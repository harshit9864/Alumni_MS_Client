import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, MapPin } from "lucide-react"; // Import icons

interface EventCardProps {
  title: string;
  date: string;
  time?: string; // Made optional to fit your interface
  content: string;
}

export default function EventCard({ title, date, time, content }: EventCardProps) {
  return (
    <Card className="flex flex-col h-full border-zinc-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group overflow-hidden">
      {/* Decorative colored top bar */}
      <div className="h-2 w-full bg-gradient-to-r from-violet-500 to-fuchsia-500" />
      
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-4">
          <CardTitle className="text-xl font-bold text-zinc-900 group-hover:text-violet-700 transition-colors line-clamp-2">
            {title}
          </CardTitle>
          
          {/* Date Badge */}
          <div className="flex flex-col items-center justify-center bg-zinc-50 border border-zinc-200 rounded-lg p-2 min-w-[60px] text-center shrink-0">
            <span className="text-xs font-bold text-violet-600 uppercase">
              {new Date(date).toLocaleString('default', { month: 'short' })}
            </span>
            <span className="text-xl font-extrabold text-zinc-900 leading-none">
              {new Date(date).getDate()}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-grow space-y-4">
        {/* Meta Details */}
        <div className="flex items-center gap-4 text-sm text-zinc-500">
          <div className="flex items-center gap-1.5">
            <CalendarDays className="w-4 h-4 text-violet-500" />
            <span>{new Date(date).toLocaleDateString()}</span>
          </div>
          {time && (
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-fuchsia-500" />
              <span>{time}</span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-zinc-600 text-sm leading-relaxed line-clamp-3">
          {content}
        </p>
      </CardContent>

      <CardFooter className="pt-0 mt-auto">
        <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-200">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}