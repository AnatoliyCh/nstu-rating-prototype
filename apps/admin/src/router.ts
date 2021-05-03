import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  // базовый пути приложения
  {
    path: "/",
    name: "empty",
    redirect: "/event/list",
  },
  //* пользовтели
  {
    path: "/user",
    name: "user",
    meta: {
      exact: false,
      icon: "team",
      name: "Пользователи",
    },
    component: () => import("@/common/components/v-router-parent.vue"),
    redirect: "/user/list",
    children: [
      // список пользователей
      {
        path: "/user/list",
        name: "user-list",
        meta: {
          exact: true,
        },
        component: () => import("@/common/components/user/v-user-list.vue"),
      },
      // создание пользователя
      {
        path: "/user/create",
        name: "user-create",
        meta: {
          exact: true,
        },
        component: () => import("@/common/components/user/v-add-edit-user.vue"),
      },
    ],
  },
  //* мероприятия
  {
    path: "/event",
    name: "event",
    meta: {
      exact: false,
      icon: "calendar",
      name: "Мероприятия",
    },
    component: () => import("@/common/components/v-router-parent.vue"),
    redirect: "/event/list",
    children: [
      // список мероприятий
      {
        path: "/event/list",
        name: "event-list",
        meta: {
          exact: true,
        },
        component: () => import("@/common/components/event/v-event-list.vue"),
      },
      // создание мероприятия
      {
        path: "/event/create",
        name: "event-create",
        meta: {
          exact: true,
        },
        component: () =>
          import("@/common/components/event/v-add-edit-event.vue"),
      },
      // мероприятие: детальное представление
      {
        path: "/event/:id",
        name: "event-details",
        meta: {
          exact: false,
        },
        component: () =>
          import("@/common/components/event/v-event-details.vue"),
      },
    ],
  },
  //* типы мероприятий
  {
    path: "/event-type",
    name: "event-type",
    meta: {
      exact: false,
      icon: "ordered-list",
      name: "Типы мероприятий",
    },
    component: () => import("@/common/components/v-router-parent.vue"),
    redirect: "/event-type/list",
    children: [
      // список типов мероприятия
      {
        path: "/event-type/list",
        name: "event-type-list",
        meta: {
          exact: true,
        },
        component: () =>
          import("@/common/components/event/event-type/v-event-type-list.vue"),
      },
      // создание типа мероприятия
      {
        path: "/event-type/create",
        name: "event-type-create",
        meta: {
          exact: true,
        },
        component: () =>
          import(
            "@/common/components/event/event-type/v-add-edit-details-event-type.vue"
          ),
      },
      // детальное представление типа мероприятия
      {
        path: "/event-type/:id",
        name: "event-type-details",
        meta: {
          exact: true,
        },
        component: () =>
          import(
            "@/common/components/event/event-type/v-add-edit-details-event-type.vue"
          ),
      },
    ],
  },
  //* чаты
  {
    path: "/chat",
    name: "chat",
    meta: {
      exact: false,
      icon: "wechat",
      name: "Чаты",
    },
    component: () => import("@/common/components/v-router-parent.vue"),
    redirect: "/chat/list",
    children: [
      // список чатов
      {
        path: "/chat/list",
        name: "chat-list",
        meta: {
          exact: true,
        },
        component: () => import("@/common/components/chat/v-chat-list.vue"),
      },
      // чат: детальное представление
      {
        path: "/chat/:id",
        name: "chat-details",
        meta: {
          exact: false,
        },
        component: () => import("@/common/components/chat/v-chat-details.vue"),
      },
    ],
  },
];

const router = new VueRouter({ routes });

export default router;
