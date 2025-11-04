import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@clerk/nextjs";

interface CardddProps {
  title: string;
  date: string;
  content: string;
}

export default function Carddd({ title, date, content }: CardddProps) {
  return (
    <div>
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{date}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>{content}</p>
        </CardContent>
      </Card>
    </div>
  );
}
