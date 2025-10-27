import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MessageCircle, Info } from "lucide-react";

interface Step9Props {
  form: UseFormReturn<any>;
}

export default function Step9({ form }: Step9Props) {
  return (
    <div className="space-y-8">
      {/* Заголовок */}
      <div className="text-center space-y-2 pb-4">
        <div className="flex items-center justify-center gap-2">
          <MessageCircle className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Дай їм ідеальний привід почати розмову!
          </h2>
        </div>
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
          "Привіт, як справи?" — це нудно. А от "Ого, у тебе крутий плейлист!" або "Бачив твоє фото з подорожі, де це?" — це вже початок історії.
        </p>
        <p className="text-xs text-muted-foreground italic">
          Твої соцмережі — це нескінченне джерело тем для розмов.
        </p>
        <div className="flex items-center justify-center gap-2 pt-2 text-xs text-primary">
          <Info className="h-4 w-4" />
          <span>Всі поля опціональні — можеш пропустити цей крок</span>
        </div>
      </div>

      {/* Instagram */}
      <FormField
        control={form.control}
        name="instagram"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Instagram</FormLabel>
            <FormDescription>Твій username (без @)</FormDescription>
            <FormControl>
              <Input
                placeholder="твій_username"
                {...field}
                data-testid="input-instagram"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Spotify */}
      <FormField
        control={form.control}
        name="spotify"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Spotify</FormLabel>
            <FormDescription>Посилання на твій профіль або улюблений плейлист</FormDescription>
            <FormControl>
              <Input
                placeholder="https://open.spotify.com/user/..."
                {...field}
                data-testid="input-spotify"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* TikTok */}
      <FormField
        control={form.control}
        name="tiktok"
        render={({ field }) => (
          <FormItem>
            <FormLabel>TikTok</FormLabel>
            <FormDescription>Username або посилання</FormDescription>
            <FormControl>
              <Input
                placeholder="@твій_username або посилання"
                {...field}
                data-testid="input-tiktok"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Telegram */}
      <FormField
        control={form.control}
        name="telegram"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Telegram</FormLabel>
            <FormDescription>Твій username (без @)</FormDescription>
            <FormControl>
              <Input
                placeholder="твій_username"
                {...field}
                data-testid="input-telegram"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Twitter/X */}
      <FormField
        control={form.control}
        name="twitter"
        render={({ field }) => (
          <FormItem>
            <FormLabel>X (Twitter)</FormLabel>
            <FormDescription>Твій username (без @)</FormDescription>
            <FormControl>
              <Input
                placeholder="твій_username"
                {...field}
                data-testid="input-twitter"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Contact Email */}
      <FormField
        control={form.control}
        name="contactEmail"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email для контакту</FormLabel>
            <FormDescription>Додаткова email адреса (не та, що використовується для входу)</FormDescription>
            <FormControl>
              <Input
                type="email"
                placeholder="твоя_пошта@example.com"
                {...field}
                data-testid="input-contactemail"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Phone Number */}
      <FormField
        control={form.control}
        name="phoneNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Номер телефону</FormLabel>
            <FormDescription>При натисканні можна буде скопіювати або відкрити додаток для дзвінків</FormDescription>
            <FormControl>
              <Input
                type="tel"
                placeholder="+380..."
                {...field}
                data-testid="input-phonenumber"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
