import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Hammer } from "lucide-react";

export default function FeedPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md">
          <CardContent className="pt-8 pb-8 flex flex-col items-center gap-6">
            <motion.div
              animate={{ 
                rotate: [0, -10, 10, -10, 0],
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1,
              }}
            >
              <Home className="w-16 h-16 text-primary" />
            </motion.div>
            
            <div className="text-center space-y-3">
              <h1 className="text-2xl font-bold text-foreground">
                Стрічка
              </h1>
              <p className="text-muted-foreground text-lg">
                Тут буде стрічка подій! 📱
              </p>
              <div className="flex items-center justify-center gap-2 pt-4">
                <Hammer className="w-5 h-5 text-orange-500" />
                <p className="text-sm text-muted-foreground">
                  Наразі в розробці... Скоро тут з'являться цікаві історії!
                </p>
              </div>
            </div>

            <motion.div
              className="text-center text-xs text-muted-foreground/60 pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              💭 Поки що тут тихо, але незабаром буде шумно!
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
