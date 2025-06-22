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
    <div class="row justify-center q-mt-md">
      <q-btn-toggle
        v-model="section"
        no-caps
        unelevated
        toggle-color="primary"
        text-color="primary"
        :options="[
          { label: $t('seccionValidaciones'), value: 'val', style: 'width: 180px;' },
          { label: $t('seccionUsuarios'), value: 'users', style: 'width: 180px;' },
        ]"
        style="border-radius: 10px; background-color: #DEE1E6;"
    />
    </div>

    <!-- Tarjeta -->
    <div class="row justify-center q-mt-md q-mb-xl">
      <q-card
        flat
        bordered
        style="width: 85%; height: 570px; border: 2px solid var(--q-primary); border-radius: 30px; background: #f7f8fa;"
      >
        <!-- Avatares -->
        <!-- Avatar sección validaciones -->
        <div v-if="section === 'val'" class="row justify-center q-mt-md">
          <q-avatar size="50px" color="primary" text-color="white" icon="verified_user" />
        </div>
        <!-- Avatar sección usuarios -->
        <div v-else class="row justify-center q-mt-md">
          <q-avatar size="50px" color="primary" text-color="white" icon="person" />
        </div>

        <!-- Textos explicativo -->
        <!-- Texto sección validaciones -->
        <div v-if="section === 'val'" class="row justify-center q-mt-sm">
          <div class="col-12 col-md-8 text-center text-h6  text-primary">
            {{ $t('msgValidaciones') }}
          </div>
        </div>
        <!-- Texto sección usuarios -->
        <div v-else class="row justify-center q-mt-sm">
          <div class="col-12 col-md-8 text-center text-h6 text-weight-medium text-primary">
            {{ $t('msgIndicacionesUsuarios') }}
          </div>
        </div>

        <!-- Div que mostraremos si no hay validaciones -->
        <div
          v-if="pendingUsers.length === 0 && section === 'val'"
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
                    <q-icon name="check_circle" size="sm" />
                  </q-avatar>
                  
                  <div class="text-h7 text-weight-medium text-center"
                    style="margin-right: 17px;">
                    {{ $t('msgNoValidaciones') }}
                  </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Div que mostraremos si no hay usuarios en la plataforma -->
        <div
          v-if="users.length === 0 && section !== 'val'"
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

        <!-- Listas de usuarios con empadronamiento pendiente -->
        <div v-if="(pendingUsers.length > 0 && section === 'val') || (users.length > 0 && section !== 'val')" class="flex flex-center">
          <q-list class="q-mt-md text-primary scrollable-list justify-between" style="width: 95%;">
            <q-item
              v-for="user in usersToDisplay"
              :key="user.idUser"
              class="q-mt-sm"
              style="height: 55px; width: 100%; border-radius: 10px; background-color: #DEE1E6;"
            >
              <!-- Nombre y Apellidos -->
              <q-item-section>
                <q-item-label caption>{{ $t('nombre') }}</q-item-label>
                <q-item-label>{{ user.name }} {{ user.surname }}</q-item-label>
              </q-item-section>

              <!-- DNI -->
              <q-item-section>
                <q-item-label caption>{{ $t('dni') }}</q-item-label>
                <q-item-label>{{ user.idDocument }}</q-item-label>
              </q-item-section>

              <!-- Estado -->
              <q-item-section>
                <q-item-label caption>{{ $t('seccionTarifasReducidas') }}</q-item-label>
                <q-item-label v-if ="user.status === 'pending'">{{  $t('estadoPendiente') }} </q-item-label>
                <q-item-label v-if ="user.status === 'accepted'">{{  $t('estadoAprobado') }} </q-item-label>
                <q-item-label v-if ="user.status === 'rejected'">{{  $t('estadoRechazado') }} </q-item-label>
              </q-item-section>

              <!-- Botones -->
              <q-item-section side>
                <div class="row items-center">
                  <!-- Icono de actualización pendiente -->
                  <q-btn
                    icon="check_circle"
                    flat
                    round
                    @click="acceptUser(user)"
                    size="md"
                    :style="{
                      color: user.status === 'accepted'
                        ? (user.changed ? '#b28a17' : '#28a745') 
                        : '#74797f'
                    }"
                  />
                  <q-btn
                    icon="cancel"
                    flat
                    round
                    class="q-ml-xs"
                    @click="rejectUser(user)"
                    size="md"
                    :style="{
                      color: user.status === 'rejected'
                        ? (user.changed ? '#b28a17' : '#a52d2d')
                        : '#74797f'
                    }"
                  />
                  <q-btn
                    v-if="section !== 'val'"
                    icon="delete"
                    flat
                    round
                    class="q-ml-xs"
                    @click="deleteUser(user.idUser)"
                    size="md"
                    color="primary"
                  />
                </div>
              </q-item-section>
            </q-item>
          </q-list>

          <!-- Botón Actualizar Datos -->
          <div class="q-mt-lg">
            <q-btn
                  color="primary"
                  :label="$t('btnActualizar')"
                  no-caps
                  size="md"
                  @click="updateReducedUsers()"
                  class="q-ml-sm"
                  :disable="disableBtn"
                  style="min-width: 120px; min-height: 45px; border-radius: 10px; width: 160px;" />
          </div>
        </div>
      </q-card>
    </div>
    <!-- Dialogo para confirmar la eliminación del usuario -->
    <q-dialog v-model="showDialogDeleteUser" persistent>
      <DialogDeleteUser
        @cancel="cancelDialog"
        @delete="deleteUserFromDialog"
        />
    </q-dialog>  
  </div>

</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { apiAdminGetPendingReducedUsers, apiAdminUpdateReducedUsers, apiAdminGetUsers, apiAdminDeleteUser } from 'src/services/apiAdmin';
import { notify } from "src/utils/notify";
import { useQuasar } from 'quasar'; // Importa useQuasar para acceder a $q
import { useRouter } from "vue-router"; // Para redirigir al usuario a la pantalla principal
import { useI18n } from 'vue-i18n';
import DialogDeleteUser from "src/components/DialogDeleteUser.vue";

const $q = useQuasar();  // Usa useQuasar para obtener la instancia de $q
const router = useRouter();
const { t, locale } = useI18n(); // Hook para acceder a las traducciones

const section = ref('val');
const isLoading = ref(false);
const showDialogDeleteUser = ref(false); // Controla la visibilidad del dialog para confirmar la eliminación del usuario
const idUserDelete = ref(null); // Contendrá el id del usuario a eliminar

const pendingUsers = ref([]); // Array con todos los usuarios pendientes de validación de empadronamiento
//{ idUser: 1, name: 'Pepe', surname: 'Gonzalez', idDocument: '123456789', status: 'accepted', statusBool: true },
const users = ref([]); // Array con los usuarios no admin de la plataforma
//{ idUser: 1, name: 'Pepe', surname: 'Gonzalez', idDocument: '123456789', status: 'pending', statusOriginal: 'pending', changed: false, statusBool: true },

const validationChanged = ref(false); // Se pone a true si se cambia alguna validación

// Computada que nos permite mostrar en la lista las validaciones o los usuarios
const usersToDisplay = computed(() => {
  if (section.value === 'val') {
    return pendingUsers.value;
  } else {
    return users.value;
  }
});


const getPendingReducedUsers = async () => {
  try {
    isLoading.value = true;
    const response = await apiAdminGetPendingReducedUsers();
    // Añadimos a cada elemento del response la propiedad status: 'pending'
    pendingUsers.value = response.map(user => ({ ...user, status: 'pending' }));
    validationChanged.value = false;
    //console.log(pendingUsers.value);
  } catch (error) {
    console.error(error);
    notify($q, t, error, 'nok');
    router.push('/');           // Redireccionamos a home en caso de error obteniendo los datos
  } finally {
    isLoading.value = false;
  }
};

const getUsers = async () => {
  try {
    isLoading.value = true;
    const response = await apiAdminGetUsers();

    // Añadimos a cada usuario el atributo statusOriginal y changed
    response.users.forEach(user => {
      user.statusOriginal = user.status;
      user.changed = false;
    });

    users.value = response.users;
    
  } catch (error) {
    console.error(error);
    notify($q, t, error, 'nok');
    router.push('/');           // Redireccionamos a home en caso de error obteniendo los datos
  } finally {
    isLoading.value = false;
  }
};


onMounted(() => {
  getPendingReducedUsers();
  getUsers();
});

// Watch que actualizara el atributo changed del array users
watch(() => users.value, () => {
  users.value.forEach(user => {
    user.changed = user.status !== user.statusOriginal;
  });
}, { deep: true });


// Función para aceptar el empadronamiento de un usuario
const acceptUser = (user) => {
  user.status = 'accepted';
  user.statusBool = true;

  if (section.value === 'val' && validationChanged.value === false) {
    validationChanged.value = true;
  };

};

// Función para rechazar el empadronamiento de un usuario
const rejectUser = (user) => {
  user.status = 'rejected';
  user.statusBool = false;

  if (section.value === 'val' && validationChanged.value === false) {
    validationChanged.value = true;
  };
};

// Sirve tanto para la vista val como para la vista users
const updateReducedUsers = async () => {
  try {

    if (section.value === 'val') {
  
      // Verificamos que no hay ningun usuario con status = 'pending' 
      const hasPendingUser = pendingUsers.value.some(user => user.status === 'pending');
      if (hasPendingUser) {
        notify($q, t, 'msgValidacionesPendientes', 'warning');
        return;
      }

      isLoading.value = true;
      // Generamos un nuevo array con unicamente el id y el status en boolean
      const filteredUsers = pendingUsers.value.map(({ idUser, statusBool }) => ({ idUser, statusBool }));

      //console.log("filtered: ", filteredUsers);
      await apiAdminUpdateReducedUsers(filteredUsers, locale.value);
      notify($q, t, 'msgActualizacion', 'ok');
      getPendingReducedUsers();
      getUsers();
      return;

    } else {
      // Si estamos en la seccion users, actualizamos los usuarios con changed = true
      // Solo usuarios con changed = true
      let usersToUpdate = users.value.filter(user => user.changed);

      if (usersToUpdate.length === 0) {
        notify($q, t, 'msgNoActualizacionesUsuarios', 'warning');
        return;
      }

      isLoading.value = true;

      // Nos quedamos unicamente con el id y el statusBool
      usersToUpdate = usersToUpdate.map(({ idUser, statusBool }) => ({ idUser, statusBool }));
      //console.log("Users to update: ", usersToUpdate);

      // El array usersToUpdate ya tiene unicamente el id y el status en booleano
      await apiAdminUpdateReducedUsers(usersToUpdate);
      notify($q, t, 'msgActualizacion', 'ok');
      getUsers();
    }
  
  } catch (error) {
    console.error(error);
    notify($q, t, error, 'nok');

  } finally {
    isLoading.value = false;
  }
};

const disableBtn = computed(() => {
  if (section.value === 'val') {
    return !validationChanged.value;
  } else {
    return !users.value.some(user => user.changed);
  }
});


const deleteUser = async (idUser) => {
  // console.log("Eliminar!");
  // Mostramos dialogo de confirmación de eliminación
  idUserDelete.value = idUser;
  showDialogDeleteUser.value = true;
};

// Métodos que nos vienen desde el dialogo de confirmación de eliminación
// Cancelamos la eliminación
const cancelDialog = () => {
  // Cerramos el dialogo y no hacemos nada mas
  showDialogDeleteUser.value = false;
  idUserDelete.value = null;
};

// Eliminamos el usuario
const deleteUserFromDialog = async () => {
  try {
    showDialogDeleteUser.value = false;
    isLoading.value = true;
    // Llamamos a la API para eliminar el usuario
    await apiAdminDeleteUser(idUserDelete.value);
    notify($q, t, 'usuarioEliminado', 'ok');
    getPendingReducedUsers();
    getUsers();

  } catch (error) {
    notify($q, t, error, 'nok');
  } finally {
    isLoading.value = false;
    idUserDelete.value = null;
  }
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
