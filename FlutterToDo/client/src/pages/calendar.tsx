import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar as CalendarIcon, Plus, Edit, Trash2, ChevronDown, ChevronUp, CalendarDays, Star, Globe, Clock, Flag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { formatDateTime, formatTime } from "@/lib/utils";
import Header from "@/components/layout/header";
import { Link } from "wouter";

const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  date: z.string().datetime().or(z.date()),
  time: z.string().optional(),
  type: z.string().default("appointment"),
  userId: z.number().default(1),
});

type EventFormData = z.infer<typeof eventSchema>;

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [showAllUpcoming, setShowAllUpcoming] = useState(false);
  const queryClient = useQueryClient();

  const { data: events = [], isLoading, error } = useQuery({
    queryKey: ["/api/events"],
  });

  console.log('📅 Calendar events loaded:', events?.length || 0, events);

  const createEventMutation = useMutation({
    mutationFn: (data: EventFormData) => apiRequest("POST", "/api/events", data),
    onSuccess: (response) => {
      console.log('✅ Event created successfully:', response);
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      form.reset();
      setIsDialogOpen(false);
    },
    onError: (error) => {
      console.error('❌ Error creating event:', error);
    },
  });

  const updateEventMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: EventFormData }) => 
      apiRequest("PUT", `/api/events/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      setIsEditDialogOpen(false);
      setEditingEvent(null);
    },
  });

  const deleteEventMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/events/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
    },
  });

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      date: new Date(),
      type: "appointment",
      userId: 1,
    },
  });

  const onSubmit = (data: EventFormData) => {
    let eventDate = selectedDate || new Date();
    
    // Если указано время, объединяем его с датой
    if (data.time) {
      const [hours, minutes] = data.time.split(':');
      eventDate = new Date(eventDate);
      eventDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    } else {
      // Если время не указано, ставим 12:00
      eventDate = new Date(eventDate);
      eventDate.setHours(12, 0, 0, 0);
    }
    
    const eventData = {
      ...data,
      date: eventDate.toISOString(),
      userId: 1
    };
    console.log('Submitting event data:', eventData);
    createEventMutation.mutate(eventData);
  };

  const eventsForSelectedDate = events.filter((event: any) => {
    if (!selectedDate) return false;
    const eventDate = new Date(event.date);
    return eventDate.toDateString() === selectedDate.toDateString();
  });

  // Получаем даты с событиями для отметок на календаре
  const datesWithEvents = events.map((event: any) => new Date(event.date));

  // Получаем события на ближайшую неделю
  const now = new Date();
  const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  const upcomingEvents = events
    .filter((event: any) => {
      const eventDate = new Date(event.date);
      return eventDate >= now && eventDate <= oneWeekFromNow;
    })
    .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Функция для проверки есть ли события в конкретный день
  const hasEvents = (date: Date) => {
    return datesWithEvents.some(eventDate => 
      eventDate.toDateString() === date.toDateString()
    );
  };

  // Функция для получения количества событий в день
  const getEventsCountForDate = (date: Date) => {
    return datesWithEvents.filter(eventDate => 
      eventDate.toDateString() === date.toDateString()
    ).length;
  };

  // Проверяем, выбрана ли сегодняшняя дата
  const today = new Date();
  const isToday = selectedDate && 
    selectedDate.toDateString() === today.toDateString();

  // Функция для возврата к сегодняшней дате
  const goToToday = () => {
    const today = new Date();
    setSelectedDate(today);
    setCurrentMonth(today);
  };

  // Получаем факты о выбранной дате
  const getDateFacts = (date: Date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    // Государственные праздники
    const holidays = {
      // Российские праздники
      "1-1": "Новый год",
      "1-7": "Рождество Христово",
      "2-23": "День защитника Отечества", 
      "3-8": "Международный женский день",
      "5-1": "Праздник Весны и Труда",
      "5-9": "День Победы",
      "6-12": "День России",
      "11-4": "День народного единства",
      
      // Белорусские государственные праздники
      "1-2": "День второй (Беларусь)",
      "3-15": "День Конституции Республики Беларусь",
      "7-3": "День Независимости Республики Беларусь",
      "11-7": "День Октябрьской революции - Беларусь"
    };

    // Белорусские памятные и неофициальные дни
    const belarusianDays = {
      "1-17": "День белорусской науки",
      "2-17": "День белорусской культуры",
      "2-21": "Международный день родного языка (День белорусского языка)",
      "4-26": "День памяти Чернобыльской катастрофы",
      "5-15": "День семьи (Беларусь)",
      "6-1": "День защиты детей (Беларусь)",
      "6-23": "Международный Олимпийский день / День молодёжи Беларуси",
      "7-6": "День Ивана Купалы",
      "8-27": "День кино Беларуси",
      "9-8": "День белорусской письменности",
      "9-17": "День народного единства (Беларусь)",
      "10-1": "День пожилых людей (Беларусь)",
      "10-14": "День матери (Беларусь)",
      "11-19": "День ракетных войск и артиллерии (Беларусь)",
      "12-19": "День белорусского кино"
    };

    // Международные дни
    const internationalDays = {
      "1-27": "Международный день памяти жертв Холокоста",
      "2-14": "День святого Валентина",
      "3-20": "Международный день счастья",
      "4-22": "День Земли",
      "5-15": "Международный день семьи",
      "6-5": "Всемирный день окружающей среды",
      "7-11": "Всемирный день народонаселения",
      "8-19": "Всемирный день гуманитарной помощи",
      "9-21": "Международный день мира",
      "10-16": "Всемирный день продовольствия",
      "11-20": "Всемирный день ребёнка",
      "12-10": "День прав человека"
    };

    // Исторические события
    const historicalEvents = {
      "4-12": "1961 - Первый полёт человека в космос (Юрий Гагарин)",
      "7-20": "1969 - Первая высадка человека на Луну",
      "11-9": "1989 - Падение Берлинской стены",
      "12-25": "1991 - Распад СССР",
      "6-12": "1990 - Принята Декларация о государственном суверенитете России",
      "8-19": "1991 - Попытка государственного переворота в СССР",
      "10-3": "1993 - Конституционный кризис в России"
    };

    const dateKey = `${month}-${day}`;
    const facts = [];

    if (holidays[dateKey]) {
      facts.push({ type: "holiday", text: holidays[dateKey] });
    }
    
    if (belarusianDays[dateKey]) {
      facts.push({ type: "belarusian", text: belarusianDays[dateKey] });
    }
    
    if (internationalDays[dateKey]) {
      facts.push({ type: "international", text: internationalDays[dateKey] });
    }
    
    if (historicalEvents[dateKey]) {
      facts.push({ type: "historical", text: historicalEvents[dateKey] });
    }

    return facts;
  };

  const dateFacts = selectedDate ? getDateFacts(selectedDate) : [];

  // Функция для получения русского названия и стиля типа события
  const getEventTypeInfo = (type: string) => {
    const typeMap = {
      'appointment': { label: 'Встреча', color: 'bg-blue-100 text-blue-800 border-blue-200' },
      'deadline': { label: 'Дедлайн', color: 'bg-red-100 text-red-800 border-red-200' },
      'meeting': { label: 'Собрание', color: 'bg-green-100 text-green-800 border-green-200' },
      'note': { label: 'Заметка', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      'reminder': { label: 'Напоминание', color: 'bg-purple-100 text-purple-800 border-purple-200' },
      'task': { label: 'Задача', color: 'bg-orange-100 text-orange-800 border-orange-200' },
      'personal': { label: 'Личное', color: 'bg-pink-100 text-pink-800 border-pink-200' }
    };
    return typeMap[type as keyof typeof typeMap] || { label: type, color: 'bg-gray-100 text-gray-800 border-gray-200' };
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-md">
        <div className="mb-6">
          <Link href="/" className="text-primary hover:underline mb-4 inline-block text-sm">
            ← Назад к Панели
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CalendarIcon className="w-6 h-6 text-primary" />
              <h1 className="font-bold tracking-wide text-[23px]">Календарь</h1>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="premium-button text-sm">
                  <Plus className="w-4 h-4 mr-1" />
                  Добавить
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[350px] mx-4">
                <DialogHeader>
                  <DialogTitle className="text-lg">Создать Новое Событие</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">Название</FormLabel>
                          <FormControl>
                            <Input placeholder="Название события" {...field} className="text-sm" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">Описание</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Описание события" 
                              {...field} 
                              className="text-sm min-h-[60px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">Тип</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="text-sm">
                                <SelectValue placeholder="Выберите тип события" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="appointment">Встреча</SelectItem>
                              <SelectItem value="deadline">Дедлайн</SelectItem>
                              <SelectItem value="meeting">Собрание</SelectItem>
                              <SelectItem value="note">Заметка</SelectItem>
                              <SelectItem value="reminder">Напоминание</SelectItem>
                              <SelectItem value="task">Задача</SelectItem>
                              <SelectItem value="personal">Личное</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">Время (необязательно)</FormLabel>
                          <FormControl>
                            <Input 
                              type="time" 
                              {...field} 
                              className="text-sm"
                              placeholder="Выберите время"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full premium-button text-sm"
                      disabled={createEventMutation.isPending}
                    >
                      {createEventMutation.isPending ? "Создается..." : "Создать Событие"}
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>

            {/* Диалог редактирования событий */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent className="max-w-[350px] mx-4">
                <DialogHeader>
                  <DialogTitle className="text-lg">Редактировать Событие</DialogTitle>
                </DialogHeader>
                {editingEvent && (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit((data) => {
                      let eventDate = selectedDate || new Date(editingEvent.date);
                      
                      // Если указано время, объединяем его с датой
                      if (data.time) {
                        const [hours, minutes] = data.time.split(':');
                        eventDate = new Date(eventDate);
                        eventDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
                      } else {
                        // Если время не указано, сохраняем время из оригинального события или ставим 12:00
                        const originalDate = new Date(editingEvent.date);
                        eventDate = new Date(eventDate);
                        eventDate.setHours(originalDate.getHours(), originalDate.getMinutes(), 0, 0);
                      }
                      
                      updateEventMutation.mutate({ 
                        id: editingEvent.id, 
                        data: { ...data, date: eventDate.toISOString(), userId: 1 }
                      });
                    })} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">Название</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Название события" 
                                {...field} 
                                defaultValue={editingEvent.title}
                                className="text-sm" 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">Описание</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Описание события" 
                                {...field} 
                                defaultValue={editingEvent.description || ''}
                                className="text-sm min-h-[60px]"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">Тип</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={editingEvent.type}>
                              <FormControl>
                                <SelectTrigger className="text-sm">
                                  <SelectValue placeholder="Выберите тип события" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="appointment">Встреча</SelectItem>
                                <SelectItem value="deadline">Дедлайн</SelectItem>
                                <SelectItem value="meeting">Собрание</SelectItem>
                                <SelectItem value="note">Заметка</SelectItem>
                                <SelectItem value="reminder">Напоминание</SelectItem>
                                <SelectItem value="task">Задача</SelectItem>
                                <SelectItem value="personal">Личное</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="time"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">Время (необязательно)</FormLabel>
                            <FormControl>
                              <Input 
                                type="time" 
                                {...field} 
                                defaultValue={(() => {
                                  const eventDate = new Date(editingEvent.date);
                                  return eventDate.toTimeString().slice(0, 5);
                                })()}
                                className="text-sm"
                                placeholder="Выберите время"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex space-x-2">
                        <Button 
                          type="submit" 
                          className="flex-1 premium-button text-sm"
                          disabled={updateEventMutation.isPending}
                        >
                          {updateEventMutation.isPending ? "Сохраняется..." : "Сохранить"}
                        </Button>
                        <Button 
                          type="button"
                          variant="outline"
                          className="flex-1 text-sm"
                          onClick={() => setIsEditDialogOpen(false)}
                        >
                          Отмена
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="space-y-6">
          {/* Краткий обзор предстоящих событий */}
          <Card className="premium-card">
            <CardHeader>
              <CardTitle className="text-[23px]">Предстоящие События</CardTitle>
            </CardHeader>
            <CardContent className="text-[19px]">
              {isLoading ? (
                <p className="text-muted-foreground text-sm">Загрузка...</p>
              ) : upcomingEvents.length === 0 ? (
                <p className="text-muted-foreground text-sm">Нет событий на ближайшую неделю</p>
              ) : (
                <div className="space-y-2">
                  {/* Первые 3 события всегда видны */}
                  {upcomingEvents.slice(0, 3).map((event: any) => (
                    <div key={event.id} className="flex items-center space-x-3 p-2 bg-muted/10 rounded">
                      <div className={`w-3 h-3 rounded-full ${
                        getEventTypeInfo(event.type).color.includes('blue') ? 'bg-blue-500' :
                        getEventTypeInfo(event.type).color.includes('red') ? 'bg-red-500' :
                        getEventTypeInfo(event.type).color.includes('green') ? 'bg-green-500' :
                        getEventTypeInfo(event.type).color.includes('yellow') ? 'bg-yellow-500' :
                        getEventTypeInfo(event.type).color.includes('purple') ? 'bg-purple-500' :
                        getEventTypeInfo(event.type).color.includes('orange') ? 'bg-orange-500' :
                        'bg-pink-500'
                      }`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{event.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(event.date).toLocaleDateString('ru-RU')} • {formatTime(event.date)} • {getEventTypeInfo(event.type).label}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {/* Выпадающая секция для дополнительных событий */}
                  {upcomingEvents.length > 3 && (
                    <>
                      {showAllUpcoming && (
                        <div className="space-y-2">
                          {upcomingEvents.slice(3).map((event: any) => (
                            <div key={event.id} className="flex items-center space-x-3 p-2 bg-muted/10 rounded">
                              <div className={`w-3 h-3 rounded-full ${
                                getEventTypeInfo(event.type).color.includes('blue') ? 'bg-blue-500' :
                                getEventTypeInfo(event.type).color.includes('red') ? 'bg-red-500' :
                                getEventTypeInfo(event.type).color.includes('green') ? 'bg-green-500' :
                                getEventTypeInfo(event.type).color.includes('yellow') ? 'bg-yellow-500' :
                                getEventTypeInfo(event.type).color.includes('purple') ? 'bg-purple-500' :
                                getEventTypeInfo(event.type).color.includes('orange') ? 'bg-orange-500' :
                                'bg-pink-500'
                              }`}></div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{event.title}</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(event.date).toLocaleDateString('ru-RU')} • {formatTime(event.date)} • {getEventTypeInfo(event.type).label}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAllUpcoming(!showAllUpcoming)}
                        className="w-full text-xs text-muted-foreground hover:text-foreground"
                      >
                        {showAllUpcoming ? (
                          <>
                            <ChevronUp className="w-3 h-3 mr-1" />
                            Скрыть {upcomingEvents.length - 3} событий
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-3 h-3 mr-1" />
                            Показать ещё {upcomingEvents.length - 3} событий
                          </>
                        )}
                      </Button>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="premium-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-[23px]">Выберите Дату</CardTitle>
                {!isToday && (
                  <Button
                    onClick={goToToday}
                    variant="default"
                    size="sm"
                    className="text-xs"
                  >
                    <CalendarDays className="w-3 h-3 mr-1" />
                    Сегодня
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                className="rounded-md border text-sm"
                weekStartsOn={1}
                modifiers={{
                  hasEvents: datesWithEvents
                }}
                modifiersClassNames={{
                  hasEvents: "relative bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700 after:content-[''] after:absolute after:bottom-0.5 after:left-1/2 after:transform after:-translate-x-1/2 after:w-2 after:h-2 after:bg-blue-500 after:rounded-full"
                }}
                formatters={{
                  formatCaption: (date) => {
                    const months = [
                      'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
                      'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
                    ];
                    return `${months[date.getMonth()]} ${date.getFullYear()}`;
                  },
                  formatWeekdayName: (date) => {
                    const weekdays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
                    return weekdays[date.getDay()];
                  }
                }}
              />
            </CardContent>
          </Card>

          <Card className="premium-card">
            <CardHeader>
              <CardTitle className="text-[23px]">
                События на {selectedDate?.toLocaleDateString('ru-RU', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-muted-foreground text-sm">Загрузка событий...</p>
              ) : eventsForSelectedDate.length === 0 ? (
                <div className="space-y-3">
                  <p className="text-muted-foreground text-sm">Нет событий на эту дату.</p>
                  <Button 
                    onClick={() => setIsDialogOpen(true)}
                    className="w-full premium-button text-sm"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Добавить Событие
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {eventsForSelectedDate.map((event: any) => (
                    <Card key={event.id} className="glass-effect">
                      <CardContent className="p-3 text-[19px]">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0 pr-2">
                            <h3 className="font-semibold text-sm truncate">{event.title}</h3>
                            {event.description && (
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {event.description}
                              </p>
                            )}
                            <div className="flex items-center justify-between mt-2">
                              <p className="text-xs text-muted-foreground">
                                {formatDateTime(event.date)}
                              </p>
                              <span className={`text-xs px-2 py-1 rounded-full border ${getEventTypeInfo(event.type).color}`}>
                                {getEventTypeInfo(event.type).label}
                              </span>
                            </div>
                          </div>
                          <div className="flex space-x-1 flex-shrink-0">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-8 w-8 p-0"
                              onClick={() => {
                                setEditingEvent(event);
                                setIsEditDialogOpen(true);
                              }}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-8 w-8 p-0"
                              onClick={() => deleteEventMutation.mutate(event.id)}
                              disabled={deleteEventMutation.isPending}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  <Button 
                    onClick={() => setIsDialogOpen(true)}
                    className="w-full premium-button text-sm mt-3"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Добавить Ещё
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Факты о выбранной дате */}
          <Card className="premium-card">
            <CardHeader>
              <CardTitle className="text-[23px]">Сегодня:</CardTitle>
            </CardHeader>
            <CardContent>
              {dateFacts.length === 0 ? (
                <p className="text-muted-foreground text-sm">Нет особых событий для этой даты</p>
              ) : (
                <div className="space-y-3">
                  {dateFacts.map((fact: any, index: number) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-muted/10 rounded-lg">
                      <div className="flex-shrink-0 mt-0.5">
                        {fact.type === "holiday" && (
                          <Star className="w-4 h-4 text-yellow-500" />
                        )}
                        {fact.type === "belarusian" && (
                          <Flag className="w-4 h-4 text-red-500" />
                        )}
                        {fact.type === "international" && (
                          <Globe className="w-4 h-4 text-blue-500" />
                        )}
                        {fact.type === "historical" && (
                          <Clock className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium leading-relaxed">{fact.text}</p>
                        <span className={`inline-block text-xs px-2 py-1 rounded-full mt-1 ${
                          fact.type === "holiday" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400" :
                          fact.type === "belarusian" ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400" :
                          fact.type === "international" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400" :
                          "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                        }`}>
                          {fact.type === "holiday" ? "Государственный праздник" :
                           fact.type === "belarusian" ? "Белорусский день" :
                           fact.type === "international" ? "Международный день" :
                           "Историческое событие"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
