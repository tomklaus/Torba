import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Heart, MessageCircle, Settings, Check } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/10 via-background to-blue-900/10">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Мій профіль
          </h1>
          <Button size="icon" variant="outline" data-testid="button-settings">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Success Message */}
        <Card className="mb-8 border-green-500/30 bg-green-500/10">
          <CardHeader>
            <CardTitle className="text-green-400 flex items-center gap-2">
              <Check className="h-6 w-6" />
              Реєстрацію завершено!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground">
              Вітаємо! Ваш профіль створено. Тепер ви можете почати знайомитися з іншими користувачами.
            </p>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="hover-elevate cursor-pointer transition-all" data-testid="card-search">
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <User className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="font-semibold mb-1">Пошук</h3>
              <p className="text-sm text-muted-foreground">
                Знайди людей поруч
              </p>
            </CardContent>
          </Card>

          <Card className="hover-elevate cursor-pointer transition-all" data-testid="card-likes">
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Heart className="h-6 w-6 text-pink-400" />
              </div>
              <h3 className="font-semibold mb-1">Вподобання</h3>
              <p className="text-sm text-muted-foreground">
                Хто лайкнув тебе
              </p>
            </CardContent>
          </Card>

          <Card className="hover-elevate cursor-pointer transition-all" data-testid="card-chats">
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageCircle className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="font-semibold mb-1">Чати</h3>
              <p className="text-sm text-muted-foreground">
                Твої розмови
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Profile Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Попередній перегляд профілю</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-64 bg-muted/30 rounded-lg">
              <div className="text-center text-muted-foreground">
                <User className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Попередній перегляд профілю буде доступний після завершення розробки</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Це тестова версія. Функціонал профілю буде доступний в наступних етапах розробки.</p>
        </div>
      </div>
    </div>
  );
}
