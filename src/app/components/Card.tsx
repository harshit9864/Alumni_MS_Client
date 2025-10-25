import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CardddProps {
  title: string;
  date: string;
  attend: number;
  role: string;
}

export default function Carddd({ title, date, attend, role }: CardddProps) {
  return (
    <div>
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{date}</CardDescription>
          {role === "alumni" ? <CardAction>Join Event</CardAction> : ""}
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
        <CardFooter>
          <p>{attend}</p>
        </CardFooter>
      </Card>
    </div>
  );
}
