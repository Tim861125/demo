<script setup lang="ts">
import { ref } from 'vue'
import {
  DialogRoot,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
  SwitchRoot,
  SwitchThumb,
  TabsRoot,
  TabsList,
  TabsTrigger,
  TabsContent,
} from 'radix-vue'

const notifications = ref(true)
const marketing = ref(false)
</script>

<template>
  <main class="min-h-screen flex items-center justify-center p-6">
    <div class="w-full max-w-2xl rounded-2xl bg-slate-900/60 backdrop-blur border border-slate-700 shadow-2xl p-8">
      <header class="mb-6">
        <h1 class="text-3xl font-bold text-white">Radix Vue Demo</h1>
        <p class="text-slate-400 mt-1">Bun + Vue 3 + radix-vue + Tailwind CSS</p>
      </header>

      <TabsRoot default-value="overview" class="flex flex-col gap-4">
        <TabsList class="inline-flex bg-slate-800 rounded-lg p-1 self-start">
          <TabsTrigger
            value="overview"
            class="px-4 py-2 text-sm font-medium text-slate-300 rounded-md data-[state=active]:bg-slate-700 data-[state=active]:text-white transition"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            class="px-4 py-2 text-sm font-medium text-slate-300 rounded-md data-[state=active]:bg-slate-700 data-[state=active]:text-white transition"
          >
            Settings
          </TabsTrigger>
          <TabsTrigger
            value="about"
            class="px-4 py-2 text-sm font-medium text-slate-300 rounded-md data-[state=active]:bg-slate-700 data-[state=active]:text-white transition"
          >
            About
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" class="rounded-lg bg-slate-800/50 p-5">
          <h2 class="text-lg font-semibold text-white mb-2">Welcome</h2>
          <p class="text-slate-300 leading-relaxed">
            This page demonstrates three Radix Vue primitives: Tabs, Switch, and Dialog. They are
            unstyled, accessible, and composable — perfect for building custom UIs.
          </p>
          <DialogRoot>
            <DialogTrigger
              class="mt-4 inline-flex items-center px-4 py-2 rounded-md bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium transition"
            >
              Open Dialog
            </DialogTrigger>
            <DialogPortal>
              <DialogOverlay class="fixed inset-0 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in" />
              <DialogContent
                class="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md rounded-xl bg-slate-900 border border-slate-700 p-6 shadow-2xl"
              >
                <DialogTitle class="text-white text-lg font-semibold">Hello from Radix</DialogTitle>
                <DialogDescription class="text-slate-400 mt-2 text-sm">
                  This dialog is accessible by default — focus trapped, ESC to close, scroll
                  locked. No effort required.
                </DialogDescription>
                <div class="mt-5 flex justify-end">
                  <DialogClose
                    class="px-4 py-2 rounded-md bg-slate-700 hover:bg-slate-600 text-white text-sm transition"
                  >
                    Close
                  </DialogClose>
                </div>
              </DialogContent>
            </DialogPortal>
          </DialogRoot>
        </TabsContent>

        <TabsContent value="settings" class="rounded-lg bg-slate-800/50 p-5 space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-white font-medium">Notifications</p>
              <p class="text-slate-400 text-sm">Receive updates about activity.</p>
            </div>
            <SwitchRoot
              v-model:checked="notifications"
              class="relative h-6 w-11 rounded-full bg-slate-700 data-[state=checked]:bg-indigo-500 transition"
            >
              <SwitchThumb class="block h-5 w-5 rounded-full bg-white shadow translate-x-0.5 data-[state=checked]:translate-x-[22px] transition-transform" />
            </SwitchRoot>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <p class="text-white font-medium">Marketing emails</p>
              <p class="text-slate-400 text-sm">Occasional product news.</p>
            </div>
            <SwitchRoot
              v-model:checked="marketing"
              class="relative h-6 w-11 rounded-full bg-slate-700 data-[state=checked]:bg-indigo-500 transition"
            >
              <SwitchThumb class="block h-5 w-5 rounded-full bg-white shadow translate-x-0.5 data-[state=checked]:translate-x-[22px] transition-transform" />
            </SwitchRoot>
          </div>

          <p class="text-xs text-slate-500 pt-2">
            notifications = {{ notifications }} · marketing = {{ marketing }}
          </p>
        </TabsContent>

        <TabsContent value="about" class="rounded-lg bg-slate-800/50 p-5">
          <h2 class="text-lg font-semibold text-white mb-2">About</h2>
          <ul class="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>Bun {{ '1.3+' }} as package manager &amp; runtime</li>
            <li>Vue 3 with TypeScript</li>
            <li>radix-vue for accessible primitives</li>
            <li>Tailwind CSS v4 for styling</li>
          </ul>
        </TabsContent>
      </TabsRoot>
    </div>
  </main>
</template>
