import { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Ruler, Users, Search as SearchIcon } from "lucide-react";
import type { Profile, User } from "@shared/schema";

type UserWithProfile = User & { profile: Profile | null };

export default function SearchPage() {
  const [, setLocation] = useLocation();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      setLocation("/");
    }
  }, [userId, setLocation]);

  const { data: users, isLoading } = useQuery<UserWithProfile[]>({
    queryKey: [`/api/users?excludeUserId=${userId}`],
    enabled: !!userId,
  });

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4 pb-24">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center gap-3 mb-6">
            <SearchIcon className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold">Пошук</h1>
          </div>
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <Skeleton className="w-20 h-20 rounded-md" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const usersWithProfiles = users?.filter(user => user.profile?.isComplete) || [];

  return (
    <div className="min-h-screen bg-background p-4 pb-24">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-6"
        >
          <SearchIcon className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Пошук</h1>
        </motion.div>

        {usersWithProfiles.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardContent className="pt-12 pb-12 text-center">
                <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg text-muted-foreground">
                  Поки що немає зареєстрованих користувачів 🤷‍♂️
                </p>
                <p className="text-sm text-muted-foreground/60 mt-2">
                  Схоже, ви перший тут! Скоро з'являться інші.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {usersWithProfiles.map((user, index) => {
              const profile = user.profile!;
              const mainPhoto = profile.publicPhotos?.[0];
              const age = calculateAge(profile.birthDate);

              return (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  data-testid={`user-card-${user.id}`}
                >
                  <Card className="hover-elevate cursor-pointer transition-all">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <Avatar className="w-20 h-20 rounded-md flex-shrink-0">
                          {mainPhoto ? (
                            <AvatarImage src={mainPhoto.url} alt={profile.name} />
                          ) : null}
                          <AvatarFallback className="rounded-md bg-gradient-to-br from-primary/20 to-primary/5 text-xl">
                            {profile.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <h3 className="font-semibold text-lg leading-tight" data-testid={`user-name-${user.id}`}>
                                {profile.name}, {age}
                              </h3>
                              {profile.city && (
                                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                                  <MapPin className="w-3 h-3" />
                                  <span data-testid={`user-city-${user.id}`}>
                                    {profile.customCity || profile.city}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mt-3">
                            {profile.height && (
                              <Badge variant="secondary" className="text-xs">
                                <Ruler className="w-3 h-3 mr-1" />
                                {profile.height} см
                              </Badge>
                            )}
                            {profile.sexRole && (
                              <Badge variant="secondary" className="text-xs">
                                {profile.sexRole}
                              </Badge>
                            )}
                            {profile.commerceType === "yes" && (
                              <Badge className="text-xs bg-gradient-to-r from-purple-500 to-blue-500">
                                💰 Комерція
                              </Badge>
                            )}
                            {profile.commerceType === "commerce_only" && (
                              <Badge className="text-xs bg-gradient-to-r from-purple-600 to-pink-600">
                                💎 Тільки комерція
                              </Badge>
                            )}
                          </div>

                          {profile.aboutMe && (
                            <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                              {profile.aboutMe}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        {usersWithProfiles.length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-sm text-muted-foreground mt-8"
          >
            Знайдено користувачів: {usersWithProfiles.length}
          </motion.p>
        )}
      </div>
    </div>
  );
}
