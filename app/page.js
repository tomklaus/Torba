'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Skeleton } from '../components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { entranceAnimation, staggerContainer, staggerItem, successAnimation, errorAnimation } from '../lib/animations';
import { FadeIn } from '../components/ui/fade-in';
import { SlideIn } from '../components/ui/slide-in';
import { AnimatedCard } from '../components/ui/animated-card';
import { AnimatedButton } from '../components/ui/animated-button';
import { AnimatedTextarea } from '../components/ui/animated-textarea';
import { AnimatedSkeleton } from '../components/ui/animated-skeleton';
import { Fireworks } from '../components/ui/fireworks';

export default function Home() {
  const [inputText, setInputText] = useState('');
 const [textEntries, setTextEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const [showFireworks, setShowFireworks] = useState(false);

  // Load entries when the component mounts
  useEffect(() => {
    const loadEntries = async () => {
      try {
        const response = await fetch('/api/text');
        const entries = await response.json();
        setTextEntries(entries);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEntries();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!inputText.trim()) {
      setMessage('Please enter some text');
      setMessageType('error');
      return;
    }

    try {
      setSubmitting(true);
      setMessage('');
      setMessageType('');
      
      // Save the new text entry via API
      const response = await fetch('/api/text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: inputText }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save text');
      }
      
      const newEntry = await response.json();
      
      // Update the local state to include the new entry with animation key
      setTextEntries([newEntry, ...textEntries]);
      
      // Clear the input field
      setInputText('');
      
      setMessage('Text saved successfully!');
      setMessageType('success');
      
      // Trigger fireworks animation
      setShowFireworks(true);
    } catch (error) {
      console.error('Error saving text:', error);
      setMessage(error.message || 'Error saving text. Please try again.');
      setMessageType('error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFireworksComplete = () => {
    setShowFireworks(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 animate-fade-in relative overflow-hidden">
      <Fireworks show={showFireworks} onComplete={handleFireworksComplete} />
      <div className="max-w-2xl mx-auto relative z-10">
        <FadeIn>
          <AnimatedCard className="overflow-hidden">
            <CardHeader className="text-center pb-4">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  Torba Text Storage
                </CardTitle>
              </motion.div>
              <CardDescription className="mt-2 text-lg">
                Save and retrieve your text entries
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <SlideIn direction="up" delay={0.1}>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="textInput" className="text-base">Enter your text</Label>
                    <AnimatedTextarea
                      id="textInput"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Type your text here..."
                      rows={4}
                      disabled={submitting}
                      className="text-base"
                    />
                  </div>
                  
                  <AnimatedButton 
                    type="submit" 
                    disabled={submitting} 
                    className="w-full py-6 text-lg font-semibold transition-all duration-300 hover:shadow-lg"
                    variant="default"
                    size="default"
                  >
                    {submitting ? (
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="inline-block mr-2"
                      >
                        🔄
                      </motion.span>
                    ) : null}
                    {submitting ? 'Saving...' : 'Save Text'}
                  </AnimatedButton>
                </form>
              </SlideIn>
              
              <AnimatePresence>
                {message && (
                  <motion.div
                    {...(messageType === 'success' ? successAnimation : errorAnimation)}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className={`mt-4 p-4 rounded-lg text-sm flex items-start ${
                      messageType === 'success' 
                        ? 'bg-green-50 text-green-700 border border-green-200' 
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                  >
                    <span className="mr-2 mt-0.5">
                      {messageType === 'success' ? '✅' : '❌'}
                    </span>
                    <span>{message}</span>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <SlideIn direction="up" delay={0.2} className="mt-8 space-y-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center justify-between"
                >
                  <h2 className="text-xl font-semibold flex items-center">
                    <span className="mr-2">📝</span> Previous Entries
                  </h2>
                  <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full">
                    {textEntries.length} {textEntries.length === 1 ? 'entry' : 'entries'}
                  </span>
                </motion.div>
                
                {loading ? (
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="space-y-4"
                  >
                    {[...Array(3)].map((_, i) => (
                      <AnimatedSkeleton key={i} className="h-24 w-full rounded-xl" />
                    ))}
                  </motion.div>
                ) : textEntries.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center py-12"
                  >
                    <div className="text-5xl mb-4">📭</div>
                    <p className="text-muted-foreground text-lg">No entries yet</p>
                    <p className="text-muted-foreground">Be the first to save some text!</p>
                  </motion.div>
                ) : (
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="space-y-4"
                  >
                    <AnimatePresence>
                      {textEntries.map((entry) => (
                        <motion.div
                          key={entry.id}
                          variants={staggerItem}
                          layout="position"
                          initial={{ opacity: 0, height: 0, scale: 0.8 }}
                          animate={{ opacity: 1, height: 'auto', scale: 1 }}
                          exit={{ opacity: 0, height: 0, scale: 0.8, transition: { duration: 0.3 } }}
                          transition={{ duration: 0.3 }}
                        >
                          <AnimatedCard className="hover-lift transition-all duration-300 border-l-4 border-l-primary/50 group">
                            <CardContent className="pt-4 relative">
                              <p className="whitespace-pre-wrap text-base group-hover:text-primary/90 transition-colors duration-200">
                                {entry.content}
                              </p>
                              <div className="flex justify-between items-center mt-3">
                                <p className="text-xs text-muted-foreground flex items-center">
                                  <span className="mr-1">🕐</span>
                                  {new Date(entry.created_at).toLocaleString()}
                                </p>
                                <div className="flex items-center space-x-2">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                    ID: {entry.id}
                                  </span>
                                  <AnimatedButton
                                    variant="destructive"
                                    size="sm"
                                    className="h-8 w-8 p-0 rounded-full"
                                    onClick={async () => {
                                      try {
                                        const response = await fetch(`/api/text/${entry.id}`, {
                                          method: 'DELETE',
                                        });
                                        
                                        if (response.ok) {
                                          // Remove the entry from the local state with animation
                                          setTextEntries(textEntries.filter(item => item.id !== entry.id));
                                        } else {
                                          console.error('Failed to delete entry');
                                        }
                                      } catch (error) {
                                        console.error('Error deleting entry:', error);
                                      }
                                    }}
                                  >
                                    <span className="sr-only">Delete</span>
                                    <span>🗑️</span>
                                  </AnimatedButton>
                                </div>
                              </div>
                            </CardContent>
                          </AnimatedCard>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                )}
              </SlideIn>
            </CardContent>
          </AnimatedCard>
        </FadeIn>
      </div>
    </div>
  );
}
