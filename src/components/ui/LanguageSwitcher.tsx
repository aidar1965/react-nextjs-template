// src/components/LanguageSwitcher.tsx
"use client";

import { useRouter, usePathname } from "next/navigation";
import { useLocale, } from "next-intl";
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const LanguageSwitcher = () => {
  const router = useRouter();
  const locale = useLocale();
  
  const pathname = usePathname();

  // Define available locales and labels
  const locales = [
    { code: "en", label: "English" },
    { code: "ru", label: "Русский" },
    { code: "kz", label: "Qazaq" },
  ];

  // Handle locale change while staying on the same page
  const handleLocaleChange = (newLocale: string) => {
    console.log(newLocale);
    if (newLocale !== locale) {
      const page = pathname.replace(`${locale}`, '');
      router.replace(`/${newLocale}${page}`);
      router.refresh();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="capitalize">
          { locales.find((l) => l.code === locale)?.label || locale }
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {locales.map(({ code, label }) => (
          <DropdownMenuItem key={code} onClick={() => handleLocaleChange(code)}>
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;