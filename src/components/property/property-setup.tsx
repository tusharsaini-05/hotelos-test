"use client"

import { ChevronRight, ImageIcon, Building2, Info, Upload, Plus } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card } from "@/components/ui/card"

export function PropertySetup() {
  return (
    <div className="container mx-auto p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid gap-8 lg:grid-cols-2">
        <div>
          <h1 className="mb-6 text-2xl font-semibold">Your OYO Property</h1>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="photos" className="border rounded-lg mb-4">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-red-100 p-2">
                    <ImageIcon className="h-5 w-5 text-red-500" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Property Photos (80%)</div>
                    <div className="text-sm text-gray-500">
                      Photos of Entrance, Reception, Lobby, Rooms & Washrooms to help guests
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-4">
                  <Progress value={80} className="h-2 bg-gray-100" />
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      {12} of {15} photos uploaded
                    </div>
                    <Button variant="default" size="sm">
                      Review
                    </Button>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <UploadCard />
                    <ImageCard />
                    <ImageCard />
                    <ImageCard />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="rooms" className="border rounded-lg mb-4">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-100 p-2">
                    <Building2 className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Rooms</div>
                    <div className="text-sm text-gray-500">
                      Add or modify room numbers, floor numbers & room categories of your property
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Room
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="info" className="border rounded-lg">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-purple-100 p-2">
                    <Info className="h-5 w-5 text-purple-500" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">General Info</div>
                    <div className="text-sm text-gray-500">
                      View your Property name, location on map, address & landmarks
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-4">
                  {/* Add your general info form here */}
                  <p className="text-sm text-gray-500">Property information form coming soon...</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="hidden lg:block">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-GAvtokfhl7mVugxPOsCJ2YeDcsncNT.png"
            alt="Hotel Management Illustration"
            width={600}
            height={400}
            className="w-full"
          />
        </div>
      </motion.div>
    </div>
  )
}

function ImageCard() {
  return (
    <Card className="relative aspect-square overflow-hidden">
      <Image
        src="/placeholder.svg?height=100&width=100"
        alt="Property"
        width={100}
        height={100}
        className="h-full w-full object-cover"
      />
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-1 top-1 h-6 w-6 rounded-full bg-white/80 hover:bg-white"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </Card>
  )
}

function UploadCard() {
  return (
    <Card className="relative aspect-square">
      <div className="flex h-full flex-col items-center justify-center gap-2 p-4">
        <div className="rounded-full bg-gray-100 p-2">
          <Upload className="h-4 w-4 text-gray-500" />
        </div>
        <span className="text-xs text-gray-500">Upload</span>
      </div>
    </Card>
  )
}

