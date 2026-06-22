<template>
  <nav class="tw-bg-primary-600 tw-flex tw-items-center tw-h-12 tw-px-4 tw-gap-3 tw-shrink-0 tw-w-full tw-sticky tw-top-0 tw-z-[1000]">

    <!-- Logo -->
    <NavLogo :href="logoHref || '/'" />

    <!-- Separator -->
    <span class="tw-w-px tw-h-6 tw-bg-white/20 tw-shrink-0" />

    <!-- Left icon toolbar -->
    <div class="tw-flex tw-items-center tw-gap-0.5">
      <NavIconButton title="Избранное" @click="$emit('favorite')">
        <svg class="tw-w-4 tw-h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
          <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"/>
        </svg>
      </NavIconButton>

      <NavIconButton title="Поиск" @click="searchBarRef?.focus()">
        <svg class="tw-w-4 tw-h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
          <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/>
        </svg>
      </NavIconButton>

      <NavIconButton title="Создать" @click="$emit('create')">
        <svg class="tw-w-4 tw-h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
        </svg>
      </NavIconButton>

      <NavIconButton title="Календарь" @click="$emit('calendar')">
        <svg class="tw-w-4 tw-h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"/>
        </svg>
      </NavIconButton>

      <NavIconButton title="История" @click="$emit('history')">
        <svg class="tw-w-4 tw-h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
        </svg>
      </NavIconButton>
    </div>

    <!-- Global search bar -->
    <NavSearchBar
      ref="searchBarRef"
      v-model="searchValue"
      placeholder="Введите номер, ФИО, телефон..."
      @update:model-value="$emit('search', $event)"
    />

    <!-- Navigation menu -->
    <div class="tw-flex tw-items-center tw-shrink-0">
      <NavMenuItem
        v-for="item in menuItems"
        :key="item.key"
        :label="item.label"
        :href="item.href"
        :has-dropdown="!!(item.children && item.children.length)"
      >
        <template v-if="item.children && item.children.length" #dropdown>
          <a
            v-for="child in item.children"
            :key="child.key"
            :href="child.href || '#'"
            class="tw-block tw-px-4 tw-py-2 tw-text-sm tw-text-gray-700 hover:tw-bg-gray-50 tw-no-underline tw-whitespace-nowrap"
          >
            {{ child.label }}
          </a>
        </template>
      </NavMenuItem>
    </div>

    <!-- User menu -->
    <NavUserMenu
      class="tw-ml-auto"
      :name="user.fio"
      :initials="user.initials"
    />
  </nav>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import NavLogo from './components/NavLogo.vue'
import NavIconButton from './components/NavIconButton.vue'
import NavSearchBar from './components/NavSearchBar.vue'
import NavMenuItem from './components/NavMenuItem.vue'
import NavUserMenu from './components/NavUserMenu.vue'

interface NavChild { key: string; label: string; href?: string }
interface NavItem { key: string; label: string; href?: string; children?: NavChild[] }
interface NavUser { fio: string; initials: string }

function safeJson<T>(json: string, fallback: T): T {
  try { return JSON.parse(json) } catch { return fallback }
}

const props = defineProps({
  userJson:  { type: String, default: '{"fio":"","initials":""}' },
  menuJson:  { type: String, default: '[]' },
  logoHref:  { type: String, default: '/' },
})

defineEmits<{
  search:   [query: string]
  favorite: []
  create:   []
  calendar: []
  history:  []
}>()

const user = computed<NavUser>(() => safeJson(props.userJson, { fio: '', initials: '' }))
const menuItems = computed<NavItem[]>(() => safeJson(props.menuJson, []))

const searchValue = ref('')
const searchBarRef = ref<{ focus: () => void } | null>(null)
</script>
