<template>
  <!-- Contenedor del Spinner -->
  <div
    v-if="isLoading"
    class="q-pa-md"
    style="
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    "
  >
    <!-- Spinner -->
    <q-spinner color="primary" size="120px" :thickness="2" />
  </div>

  <!-- Div que engloba todos los elementos a ocultar cuando este cargando-->
  <div v-if="!isLoading">

    <!-- Tarjeta -->
    <div class="row justify-center q-mt-md q-mb-xl">
      <q-card
        flat
        bordered
        style="width: 85%; height: 570px; border: 2px solid var(--q-primary); border-radius: 30px; background: #f7f8fa;"
      >
      
        <!-- Avatar sección usuarios -->
        <div  class="row justify-center q-mt-md">
          <q-avatar size="50px" color="primary" text-color="white" icon="person" />
        </div>

        <!-- Textos explicativo -->
        <!-- Texto sección usuarios -->
        <div class="row justify-center q-mt-sm">
          <div class="col-12 col-md-8 text-center text-h6 text-weight-medium text-primary">
            {{ $t('msgRfid') }}
          </div>
        </div>

        <!-- Div que mostraremos si no hay usuarios en la plataforma -->
        <div
          v-if="users.length === 0"
          class="row justify-center q-mt-xl"
        >
          <q-card
            flat
            class="q-mx-md text-primary"
            style="border-radius: 30px; background: #DEE1E6;"
            >
            <q-card-section style="padding: 0px 0px;">
              <div class="row no-wrap justify-center items-center  ">
                  <q-avatar>
                    <q-icon name="person_off" size="sm" />
                  </q-avatar>
                  
                  <div class="text-h7 text-weight-medium text-center"
                    style="margin-right: 17px;">
                    {{ $t('msgNoUsuarios') }}
                  </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Listas de usuarios -->
        <div v-if=" users.length > 0 " class="flex flex-center">


          <!-- Buscador de usuarios -->
          <div class="row q-mt-md q-gutter-sm justify-center items-center">
            <q-input
              v-model="searchFilter"
              label="Buscar por nombre, apellidos o email"
              outlined
              dense
              color="primary"
              :input-style="{ color: '#00406e', }"
              style="width: 300px"
              @keyup.enter="searchUsers"
            >
              <template v-slot:append>
                <q-icon name="search" @click="searchUsers" class="cursor-pointer" />
                <q-icon name="clear" @click="clearFilter" class="cursor-pointer" />
              </template>
            </q-input>

            <!-- <q-btn
              icon="search"
              color="primary"
              @click="searchUsers"
              dense
              no-caps
              flat
              style="border-radius: 10px;"
            /> -->

            <!-- <q-btn
              icon="clear"
              color="primary"
              @click="searchFilter = ''; searchUsers()"
              dense
              no-caps
              flat
              style="border-radius: 10px;"
            /> -->
          </div>


          <q-list class="q-mt-md text-primary scrollable-list justify-between" style="width: 95%;">
            <q-item
              v-for="user in users"
              :key="user.idUser"
              class="q-mt-sm"
              style="height: 55px; width: 100%; border-radius: 10px; background-color: #DEE1E6;"
            >
              <!-- Nombre y Apellidos -->
              <q-item-section>
                <q-item-label caption>{{ $t('nombre') }}</q-item-label>
                <q-item-label>{{ user.name }} {{ user.surname }}</q-item-label>
              </q-item-section>

              <!-- Email -->
              <q-item-section>
                <q-item-label caption>{{ $t('email') }}</q-item-label>
                <q-item-label>{{ user.email }}</q-item-label>
              </q-item-section>

              <!-- Gestión RFID -->
              <q-item-section side>
                <q-input
                  dense
                  v-model="user.rfidInput"
                  label="RFID"
                  maxlength="20"
                  bg-color="secondary"
                  outlined
                  style="width: 200px"
                  :input-style="{ color: '#00406e', }"
                />
              </q-item-section>

              <q-item-section side>
                <q-btn
                  icon="save"
                  color="primary"
                  @click="saveRFID(user)"
                  :disable="!user.rfidInput || user.rfidInput === user.rfid"
                  flat
                  round
                  dense
                />

              </q-item-section>

            </q-item>
          </q-list>

        </div>
      </q-card>

    </div>



  </div>

</template>

<script setup>
import { ref, onMounted } from 'vue';
import { apiAdminGetUsersForRFID, apiAdminSetUserRFID } from 'src/services/apiAdmin';
import { notify } from "src/utils/notify";
import { useQuasar } from 'quasar'; // Importa useQuasar para acceder a $q
import { useRouter } from "vue-router"; // Para redirigir al usuario a la pantalla principal
import { useI18n } from 'vue-i18n';

const $q = useQuasar();  // Usa useQuasar para obtener la instancia de $q
const router = useRouter();
const { t, locale } = useI18n(); // Hook para acceder a las traducciones

const isLoading = ref(false);

const searchFilter = ref(""); 

const users = ref([]); // Array con los usuarios 


const getUsers = async () => {
  try {
    isLoading.value = true;
    const response = await apiAdminGetUsersForRFID();
    //console.log("Response:", response);

    users.value = response.users.map(user => ({ ...user, rfidInput: user.rfid || "" }));
    //console.log("Users:", users.value);
    
  } catch (error) {
    console.error(error);
    notify($q, t, error, 'nok');
    router.push('/');           // Redireccionamos a home en caso de error obteniendo los datos
  } finally {
    isLoading.value = false;
  }
};


onMounted(() => {
  getUsers();
  //console.log(users.value);
});


const saveRFID = async (user) => {
  try {
    // Validación local antes de enviar
    if (!/^[a-zA-Z0-9]{4,20}$/.test(user.rfidInput)) {
      return notify($q, t, 'invalidRFID', 'warning');
    }

    await apiAdminSetUserRFID(user.idUser, user.rfidInput);
      
    user.rfid = user.rfidInput; // actualiza el valor actual
    notify($q, t, 'msgRfidActualizado', 'ok');

  } catch (error) {
    notify($q, t, error, 'nok');
  }
};

const searchUsers = async () => {
  try {
    isLoading.value = true;

    const response = await apiAdminGetUsersForRFID(searchFilter.value.trim());
    users.value = response.users.map(user => ({
      ...user,
      rfidInput: user.rfid || ""
    }));
  } catch (error) {
    console.error(error);
    notify($q, t, error, 'nok');
  } finally {
    isLoading.value = false;
  }
};

const clearFilter = () => {
  searchFilter.value = '';
  searchUsers();
};


</script>

<style lang="scss" scoped>
/* Estilo cuando el usuario es aceptado */
.user-accepted {
  background-color: #daffe0 !important; /* Verde claro */
  border: 2px solid #1b4618 !important; /* Borde verde */
  opacity: 1;
}

/* Estilo cuando el usuario es rechazado */
.user-rejected {
  background-color: #ffdddd !important; /* Rojo claro */
  border: 2px solid #a52d2d !important; /* Borde rojo */
  opacity: 1;
}

.scrollable-list {
  height: 325px; /* Tamaño máximo */
  overflow-y: auto; /* Habilitar scroll vertical */
  scrollbar-width: thin; /* Opcional: Estilo para navegadores modernos */
}

.scrollable-list::-webkit-scrollbar {
  width: 8px; /* Tamaño del scrollbar para navegadores WebKit */
}

.scrollable-list::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2); /* Color del thumb del scrollbar */
  border-radius: 4px;
}


</style>
