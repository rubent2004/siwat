<script setup lang="ts">
import { useRouter } from 'vue-router'
import IconArrowRight from '~icons/lucide/arrow-right'
import IconExternalLink from '~icons/lucide/external-link'
import IconPhone from '~icons/lucide/phone'
import FolioSheet from '../../shared/ui/FolioSheet.vue'
import { useCase } from '../case/use-case'

const router = useRouter()
const { state } = useCase()

/** «Ir al Semáforo Diagnóstico»: the consent on P01 is still required before step 1. */
function goToDiagnosis() {
  void router.push({ name: state.consentAccepted ? 'identify' : 'welcome' })
}
</script>

<template>
  <FolioSheet folio="A" caption="Asistente rápido">
    <h1 tabindex="-1" class="assistant__title">Asistente rápido</h1>
    <p>Elige lo que necesitas ahora. Funciona sin internet y sin inteligencia artificial.</p>

    <div class="assistant">
      <details class="assistant__item" name="assistant">
        <summary class="assistant__button">¿Cómo tomo una captura válida como prueba?</summary>
        <ol class="assistant__body">
          <li>Captura la pantalla completa, sin recortar: que se vean la fecha, la hora y el nombre o usuario de la cuenta.</li>
          <li>Copia el enlace de la publicación o del perfil (en los 3 puntos, «Copiar enlace»).</li>
          <li>Captura también el perfil de quien te agrede y, si hay, los comentarios.</li>
          <li>No edites, no recortes y no la reenvíes por chat: guarda el archivo original.</li>
          <li>Súbela en el Paso 2 del Semáforo para calcular su huella SHA-256 y la hora UTC.</li>
          <li>Haz todo esto antes de bloquear.</li>
        </ol>
      </details>

      <details class="assistant__item" name="assistant">
        <summary class="assistant__button">Quiero blindar mi WhatsApp y Facebook ya</summary>
        <div class="assistant__body">
          <p><strong>WhatsApp</strong></p>
          <ol>
            <li>Ajustes › Cuenta › Verificación en dos pasos › Activar. Crea un PIN de 6 dígitos.</li>
            <li>Ajustes › Privacidad: «Foto de perfil», «Info» y «Grupos» en «Mis contactos».</li>
            <li>Ajustes › Dispositivos vinculados: cierra los que no reconozcas.</li>
          </ol>
          <p><strong>Facebook</strong></p>
          <ol>
            <li>Centro de cuentas › Contraseña y seguridad › Autenticación en dos pasos.</li>
            <li>En la misma sección, «Dónde iniciaste sesión»: cierra las sesiones extrañas.</li>
            <li>Perfil › Información de contacto: deja tu teléfono y correo en «Solo yo».</li>
          </ol>
        </div>
      </details>

      <a class="assistant__button assistant__link" href="tel:126">
        <IconPhone aria-hidden="true" />
        Contactar orientación gratuita (ISDEMU 126)
      </a>
      <a
        class="assistant__secondary"
        href="https://126teorienta.gob.sv/dirservicios/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Abrir 126 Te Orienta <IconExternalLink aria-hidden="true" />
        <span class="visually-hidden">(se abre en otra pestaña)</span>
      </a>

      <button type="button" class="btn btn--primary btn--block" @click="goToDiagnosis">
        Ir al Semáforo Diagnóstico
        <IconArrowRight aria-hidden="true" />
      </button>
    </div>
  </FolioSheet>
</template>

<style scoped>
.assistant__title {
  font-size: var(--text-2xl);
  outline: none;
}

.assistant {
  display: grid;
  gap: var(--space-3);
}

.assistant__item {
  border: 1.5px solid var(--plum);
  border-radius: var(--radius-control);
  background: var(--sheet);

  &[open] {
    background: var(--plum-50);
  }
}

.assistant__button {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  min-height: 3.5rem;
  padding: var(--space-3) var(--space-4);
  font-weight: 700;
  color: var(--plum);
  cursor: pointer;
  list-style: none;

  &::-webkit-details-marker {
    display: none;
  }

  & svg {
    width: 1.25em;
    height: 1.25em;
    flex-shrink: 0;
  }
}

.assistant__link {
  border: 1.5px solid var(--plum);
  border-radius: var(--radius-control);
  background: var(--plum);
  color: #fff;
  text-decoration: none;

  &:hover {
    background: var(--plum-700);
  }
}

.assistant__secondary {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  justify-self: start;
  min-height: var(--touch);
  font-weight: 700;

  & svg {
    width: 1em;
    height: 1em;
  }
}

.assistant__body {
  display: grid;
  gap: var(--space-2);
  margin: 0;
  padding: 0 var(--space-4) var(--space-4) var(--space-6);
  font-size: var(--text-sm);

  & ol {
    display: grid;
    gap: var(--space-1);
    margin: 0;
    padding-left: var(--space-5);
  }
}

div.assistant__body {
  padding-left: var(--space-4);
}
</style>
