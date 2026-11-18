<script setup lang="ts">
import { computed, ref } from 'vue'
import IconCircleAlert from '~icons/lucide/circle-alert'
import IconLock from '~icons/lucide/lock'
import { useCase } from '../case/use-case'

const emit = defineEmits<{ opened: [] }>()
const { createLocalSpace, openLocalSpace, hasLocalSpace } = useCase()

const dialog = ref<HTMLDialogElement>()
const mode = ref<'create' | 'open'>('create')
const pseudonym = ref('')
const pin = ref('')
const error = ref('')
const busy = ref(false)
const done = ref(false)

const title = computed(() => (mode.value === 'open' ? 'Abrir mi espacio local' : 'Crear espacio local con PIN'))

defineExpose({
  open() {
    mode.value = hasLocalSpace() ? 'open' : 'create'
    pseudonym.value = ''
    pin.value = ''
    error.value = ''
    done.value = false
    dialog.value?.showModal()
  },
})

async function submit() {
  error.value = ''
  busy.value = true
  try {
    if (mode.value === 'open') {
      await openLocalSpace(pseudonym.value, pin.value)
      dialog.value?.close()
      emit('opened')
    } else {
      await createLocalSpace(pseudonym.value, pin.value)
      done.value = true
    }
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'No se pudo abrir el espacio local.'
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <dialog ref="dialog" class="sheet-dialog" aria-labelledby="space-title">
    <h2 id="space-title">{{ title }}</h2>

    <template v-if="done">
      <p>
        Listo. Tu avance se guarda cifrado en este dispositivo. Para retomarlo otro día, entra con el mismo seudónimo y
        PIN.
      </p>
      <form method="dialog">
        <button class="btn btn--primary btn--block" autofocus>Continuar</button>
      </form>
    </template>

    <form v-else class="space-form" @submit.prevent="submit">
      <p v-if="mode === 'create'">
        Es opcional. Guarda tu avance cifrado solo en este dispositivo. No uses tu nombre real.
      </p>
      <p v-else>Hay un espacio guardado en este dispositivo. Escribe tu seudónimo y PIN para abrirlo.</p>

      <div class="field">
        <label class="field__label" for="space-pseudonym">Seudónimo</label>
        <input
          id="space-pseudonym"
          v-model="pseudonym"
          class="input"
          required
          autocomplete="off"
          autocapitalize="off"
          spellcheck="false"
          autofocus
        />
      </div>
      <div class="field">
        <label class="field__label" for="space-pin">PIN de 4 números</label>
        <input
          id="space-pin"
          v-model="pin"
          class="input data"
          type="password"
          inputmode="numeric"
          pattern="\d{4}"
          maxlength="4"
          required
          autocomplete="off"
        />
      </div>
      <p v-if="error" class="error-text" role="alert">
        <IconCircleAlert role="img" aria-label="Error" />
        {{ error }}
      </p>
      <button class="btn btn--plum btn--block" :disabled="busy">
        <IconLock aria-hidden="true" />
        {{ busy ? 'Protegiendo…' : mode === 'open' ? 'Abrir mi espacio' : 'Crear mi espacio' }}
      </button>
      <button v-if="mode === 'open'" type="button" class="btn btn--ghost" @click="mode = 'create'">
        Crear uno nuevo (reemplaza el anterior)
      </button>
      <button type="button" class="btn btn--ghost" @click="dialog?.close()">Cancelar</button>
    </form>
  </dialog>
</template>

<style scoped>
.space-form {
  display: grid;
  gap: var(--space-4);
}
</style>
