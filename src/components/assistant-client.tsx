
"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { answerFiqhQuery } from "@/ai/flows/answer-fiqh-queries";
import { textToSpeech } from "@/ai/flows/text-to-speech";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles, Mic, MicOff, Volume2 } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  query: z.string().min(10, "Please ask a more detailed question.").max(500),
});

export default function AssistantClient() {
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: "",
    },
  });

  useEffect(() => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = language === 'bn' ? 'bn-BD' : language === 'hi' ? 'hi-IN' : 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const spokenText = event.results[0][0].transcript;
        form.setValue("query", spokenText);
        stopListening();
        form.handleSubmit(onSubmit)(); 
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        if (event.error === 'not-allowed') {
            toast({
                variant: 'destructive',
                title: 'Microphone Access Denied',
                description: 'Please allow microphone access in your browser settings to use the voice feature.',
            });
        } else {
             toast({
                variant: 'destructive',
                title: 'Voice Recognition Error',
                description: 'Could not recognize speech. Please check your connection and try again.',
            });
        }
        stopListening();
      };
    }
  }, [language, form, toast]);

  const startListening = () => {
    if (recognitionRef.current) {
        try {
            setIsListening(true);
            recognitionRef.current.start();
        } catch(e) {
            console.error(e);
            setIsListening(false);
             toast({
                variant: 'destructive',
                title: 'Could not start listening',
                description: 'Another recognition session might be active. Please try again.',
            });
        }
    } else {
        toast({
            variant: 'destructive',
            title: 'Voice Recognition Not Supported',
            description: 'Your browser does not support the Web Speech API.',
        });
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      setIsListening(false);
      recognitionRef.current.stop();
    }
  };

  const playAudio = async (text: string) => {
    if (!text) return;
    setIsSpeaking(true);
    try {
      const response = await textToSpeech(text);
      const audioSrc = response.media;
      if (audioRef.current) {
        audioRef.current.src = audioSrc;
        audioRef.current.play();
        audioRef.current.onended = () => setIsSpeaking(false);
      }
    } catch (error) {
      console.error("Error generating or playing audio:", error);
      setIsSpeaking(false);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setAnswer("");
    try {
      const result = await answerFiqhQuery(values);
      setAnswer(result.answer);
      if (isListening) { // Auto-play if coming from voice input
          await playAudio(result.answer);
      }
    } catch (error) {
      console.error(error);
      const errorMessage = "Sorry, I encountered an error. Please try again.";
      setAnswer(errorMessage);
       if (isListening) {
          await playAudio(errorMessage);
       }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
       <audio ref={audioRef} className="hidden" />
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary">
            {t('ask_a_question')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="query"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('your_question_about_fiqh')}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={isListening ? "Listening..." : t('question_placeholder')}
                        className="resize-none"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2">
                <Button type="submit" disabled={isLoading || isListening} className="w-full">
                    {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('getting_answer')}
                    </>
                    ) : (
                    <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        {t('ask_assistant')}
                    </>
                    )}
                </Button>
                <Button
                    type="button"
                    variant={isListening ? "destructive" : "outline"}
                    onClick={isListening ? stopListening : startListening}
                    disabled={isLoading}
                    className="w-full"
                >
                    {isListening ? (
                        <>
                            <MicOff className="mr-2 h-4 w-4" /> Stop Listening
                        </>
                    ) : (
                        <>
                            <Mic className="mr-2 h-4 w-4" /> Start Voice Session
                        </>
                    )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {(isLoading || answer) && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
                <CardTitle className="font-headline text-2xl text-primary">
                {t('answer')}
                </CardTitle>
                {answer && !isLoading && (
                    <Button variant="ghost" size="icon" onClick={() => playAudio(answer)} disabled={isSpeaking}>
                        <Volume2 className={`h-6 w-6 text-accent ${isSpeaking ? 'animate-pulse' : ''}`} />
                    </Button>
                )}
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded animate-pulse w-3/4"></div>
                <div className="h-4 bg-muted rounded animate-pulse w-full"></div>
                <div className="h-4 bg-muted rounded animate-pulse w-1/2"></div>
              </div>
            ) : (
              <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap">
                {answer}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

    