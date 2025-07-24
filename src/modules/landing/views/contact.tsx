"use client";
import { useState } from "react";
import type React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MailIcon, PhoneIcon, MapPinIcon, SendIcon } from "lucide-react";

const contactInfo = [
  {
    icon: MailIcon,
    title: "Rifqi Ilham",
    details: "a@ngerti-in.com",
  },
  {
    icon: MailIcon,
    title: "Heraldo Arman",
    details: "b@ngerti-in.com",
  },
  {
    icon: MailIcon,
    title: "Valerian Hizkia E",
    details: "c@ngerti-in.com",
  },
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    return;
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setIsSubmitting(true);

  //   // Simulate form submission
  //   await new Promise((resolve) => setTimeout(resolve, 1000));

  //   toast.success("Message sent successfully! We'll get back to you soon.");
  //   setFormData({ name: "", email: "", subject: "", message: "" });
  //   setIsSubmitting(false);
  // };

  return (
    <section id="contact" className="w-full py-24 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Get in Touch</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Have questions about our platform? We'd love to hear from you. Send
            us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="flex justify-between w-full mx-auto max-w-4xl">
          <div className="flex gap-8 w-full items-between">
            <div className="space-y-6 w-full">
              {contactInfo.map((info) => (
                <Card
                  key={info.title}
                  className="w-full h-24 border-border border-1"
                >
                  <CardContent className="w-full">
                    <div className="flex items-between gap-4">
                      <div className="bg-primary/10 size-12 flex items-center justify-center rounded-lg">
                        <info.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{info.title}</h3>
                        <p className="text-foreground font-medium mb-1">
                          {info.details}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="w-full">
              <Card className="border-border border-1">
                <CardHeader>
                  <CardTitle>Send us a message</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Your name"
                          required
                          className="border border-border"
                        />
                      </div>
                      <div className="flex gap-2 flex-col">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="your@email.com"
                          required
                          className="border border-border"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 flex-col">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="What's this about?"
                        required
                        className="border border-border"
                      />
                    </div>

                    <div className="flex gap-2 flex-col">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us more about your inquiry..."
                        rows={5}
                        required
                        className="border border-border"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full cursor-pointer"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        "Sending..."
                      ) : (
                        <>
                          <SendIcon className="h-4 w-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
