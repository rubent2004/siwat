<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import IconArrowRight from '~icons/lucide/arrow-right'
import IconShieldCheck from '~icons/lucide/shield-check'
import IconSiren from '~icons/lucide/siren'
import EmergencyDialog from '../../shared/ui/EmergencyDialog.vue'
import FolioSheet from '../../shared/ui/FolioSheet.vue'
import { useCase } from '../case/use-case'
import LocalSpaceDialog from './LocalSpaceDialog.vue'

const router = useRouter()
const { state, acceptConsent, vaultActive } = useCase()

const consent = ref(state.consentAccepted)
const emergency = ref<InstanceType<typeof EmergencyDialog>>()
const localSpace = ref<InstanceType<typeof LocalSpaceDialog>>()

function start() {
  acceptConsent()
  void router.push({ name: 'identify' })
}
</script>

<template>
  <FolioSheet folio="01">
    <h1 tabindex="-1" class="welcome__title">
      ¿Lo que vives en redes es violencia política? Descúbrelo en 2 minutos.
    </h1>
    <p>
      Identifica si existe violencia según la ley salvadoreña, respalda tus pruebas de forma segura y conoce a dónde
      acudir. Tú decides si denuncias y cuándo.
    </p>

    <div class="notice">
      <IconShieldCheck aria-hidden="true" />
      <p>
        <strong>Uso libre y privado:</strong> No necesitas dar tu nombre real. SIWAT te orienta; no envía denuncias a
        instituciones por ti.
      </p>
    </div>

    <label class="check-row">
      <input v-model="consent" type="checkbox" />
      <span>Entiendo que esta es una herramienta de orientación y acepto el aviso de privacidad.</span>
    </label>

    <div class="welcome__actions">
      <button type="button" class="btn btn--primary btn--block" :disabled="!consent" @click="start">
        Iniciar Semáforo Diagnóstico
        <IconArrowRight aria-hidden="true" />
      </button>
      <button type="button" class="btn btn--plum btn--block" @click="emergency?.open()">
        <IconSiren aria-hidden="true" />
        Estoy en peligro físico ahora
      </button>
    </div>

    <nav class="welcome__links" aria-label="Otras opciones">
      <RouterLink :to="{ name: 'assistant' }">Usar Asistente Rápido (Guía por botones)</RouterLink>
      <button type="button" class="welcome__link-button" @click="localSpace?.open()">
        {{ vaultActive ? 'Espacio local activo' : 'Crear espacio local con PIN (Opcional)' }}
      </button>
    </nav>

    <details class="privacy">
      <summary>Aviso de privacidad</summary>
      <p>
        Tus respuestas, enlaces y capturas se guardan solo en la memoria de este navegador y se borran al cerrar la
        pestaña. Nada se sube a servidores. Si creas un espacio local, se guarda cifrado con tu PIN en este
        dispositivo. En el resultado puedes borrar todo con «Limpiar datos de este dispositivo».
      </p>
    </details>
  </FolioSheet>

  <EmergencyDialog ref="emergency" />
  <LocalSpaceDialog ref="localSpace" @opened="router.push({ name: 'identify' })" />
</template>

<style scoped>
.welcome__title {
  font-size: var(--text-2xl);
  letter-spacing: -0.02em;
  outline: none;
}

.welcome__actions {
  display: grid;
  gap: var(--space-3);
  margin-top: var(--space-2);
}

.welcome__links {
  display: grid;
  gap: var(--space-1);
  justify-items: start;

  & a,
  & button {
    display: inline-flex;
    align-items: center;
    min-height: var(--touch);
    font-weight: 700;
  }
}

.welcome__link-button {
  padding: 0;
  border: 0;
  background: none;
  color: var(--plum);
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 0.2em;
}

.privacy {
  border-top: 1px dashed var(--edge);
  padding-top: var(--space-3);
  font-size: var(--text-sm);
  color: var(--ink-muted);

  & summary {
    min-height: var(--touch);
    display: flex;
    align-items: center;
    font-weight: 700;
    color: var(--plum);
    cursor: pointer;
  }
}
</style>
