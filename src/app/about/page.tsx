"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Skull,
  Instagram,
  Heart,
  BookOpen,
  Sparkles,
  Users,
  Clock,
  ChevronRight,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { AuthModal } from "@/components/admin/AuthModal";

export default function AboutPage() {
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <Header currentPath="/about" onLoginClick={() => setShowAuthModal(true)} />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[url('/images/banner1.png')] bg-cover bg-center opacity-5" />

          <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4 bg-primary/20 text-purple-light border-primary/30 px-4 py-1.5">
                <Skull className="h-4 w-4 mr-2" />
                Our Story
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                The Legend of{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">
                  Purple Skull
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Where passion meets pages, and every comic tells a story worth
                collecting.
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              {/* Image */}
              <div className="relative">
                <div className="aspect-square max-w-md mx-auto relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-purple-600/20 rounded-2xl rotate-6" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-400/20 to-primary/30 rounded-2xl -rotate-3" />
                  <div className="relative rounded-2xl overflow-hidden border border-border shadow-2xl shadow-primary/20">
                    <Image
                      src="/images/logo.png"
                      alt="Purple Skull Comics Emporium"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 text-primary">
                  <Heart className="h-5 w-5" />
                  <span className="text-sm font-semibold uppercase tracking-wider">
                    A Labor of Love
                  </span>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                  From Hobby to Haven
                </h2>

                <div className="space-y-4 text-muted-foreground">
                  <p className="text-lg">
                    It all started with a single comic book bought at a small
                    roadside stall. The colorful pages, the heroic tales, the
                    thrill of discovering new worlds—that moment sparked
                    something that would change everything.
                  </p>
                  <p>
                    What began as a childhood hobby quickly grew into an
                    all-consuming passion. Weekends were spent hunting for rare
                    issues, late nights were devoted to reading through epic
                    story arcs, and slowly but surely, a modest collection began
                    to take shape. But it wasn&apos;t just about accumulating
                    books—it was about the stories, the art, the connections
                    made with fellow enthusiasts.
                  </p>
                  <p>
                    Years later, that passion has evolved into{" "}
                    <span className="text-purple-light font-semibold">
                      Purple Skull Comics Emporium
                    </span>
                    , a place where collectors and newcomers alike can discover
                    the magic that makes comics so special. Every book in our
                    collection is hand-picked with the same enthusiasm as that
                    very first purchase.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-12 md:py-20 bg-card/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-primary/20 text-purple-light border-primary/30">
                <Sparkles className="h-4 w-4 mr-2" />
                What We Stand For
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                More Than Just Comics
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              <Card className="bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">Curated Selection</h3>
                  <p className="text-sm text-muted-foreground">
                    Every comic is personally selected for quality, story, and
                    collector value.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">Community First</h3>
                  <p className="text-sm text-muted-foreground">
                    Building a community of comic lovers who share the same
                    passion and excitement.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">Years of Trust</h3>
                  <p className="text-sm text-muted-foreground">
                    Serving collectors since day one with dedication and
                    integrity.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">Passion Driven</h3>
                  <p className="text-sm text-muted-foreground">
                    Run by a fan, for fans. Every order packed with care and
                    love.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Quote Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="relative">
                <Skull className="h-12 w-12 mx-auto text-primary/30 mb-6" />
                <blockquote className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-relaxed mb-8">
                  &ldquo;Every comic book is a portal to another world. My
                  mission is to help you find yours.&rdquo;
                </blockquote>
                <div className="flex items-center justify-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Skull className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-foreground">The Purple Skull</p>
                    <p className="text-sm text-muted-foreground">
                      Founder & Chief Collector
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Connect Section */}
        <section className="py-12 md:py-20 bg-gradient-to-br from-primary/5 via-background to-purple-600/5">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <Badge className="mb-4 bg-primary/20 text-purple-light border-primary/30">
                <Instagram className="h-4 w-4 mr-2" />
                Stay Connected
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Join Our Journey
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Follow us on Instagram for new arrivals, exclusive deals, behind
                the scenes, and to be part of our growing comic community!
              </p>

              <Link
                href="https://www.instagram.com/thepurpleskullcomicsemporium/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:opacity-90 text-white px-8 py-6 text-lg purple-glow"
                >
                  <Instagram className="h-5 w-5 mr-2" />
                  @thepurpleskullcomicsemporium
                  <ChevronRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>

              <p className="text-sm text-muted-foreground mt-6">
                DM us for inquiries, special requests, or just to chat about
                comics!
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="bg-gradient-to-r from-primary/10 via-card to-purple-600/10 border-primary/20">
                <CardContent className="p-8 md:p-12 text-center">
                  <Skull className="h-10 w-10 mx-auto text-primary mb-4" />
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                    Ready to Start Your Collection?
                  </h2>
                  <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                    Browse our catalog of carefully curated comics and find your
                    next favorite story.
                  </p>
                  <Link href="/catalog">
                    <Button
                      size="lg"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
                    >
                      Explore the Catalog
                      <ChevronRight className="h-5 w-5 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-4">
                <div className="relative w-10 h-10 overflow-hidden rounded-lg">
                  <Image
                    src="/images/logo.png"
                    alt="Purple Skull Comics Logo"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-purple-light">
                    Purple Skull
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Comics Emporium
                  </span>
                </div>
              </Link>
              <p className="text-muted-foreground text-sm max-w-md">
                Your premier destination for comic books, graphic novels, and
                collectibles. We&apos;ve been serving comic enthusiasts since 2010.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-foreground mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/catalog"
                    className="text-sm text-muted-foreground hover:text-purple-light transition-colors"
                  >
                    Catalog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-sm text-muted-foreground hover:text-purple-light transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-purple-light transition-colors"
                  >
                    Membership
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-purple-light transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-foreground mb-4">Visit Us</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>123 Comic Lane</li>
                <li>Gotham City, GC 12345</li>
                <li className="pt-2">Mon-Sat: 10AM - 9PM</li>
                <li>Sun: 11AM - 6PM</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Purple Skull Comics Emporium. All
              rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
