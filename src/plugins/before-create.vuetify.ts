import { aliases } from 'vuetify/iconsets/mdi'
import type { IconProps } from 'vuetify'
import { Icon } from '#components'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('vuetify:before-create', ({ vuetifyOptions }) => {
    vuetifyOptions.icons = {
      defaultSet: 'custom',
      sets: {
        custom: {
          component: ({ icon, tag, ...rest }: IconProps) => {
            const hChild = h(Icon, {
              name: (aliases[icon as string] ?? icon) as string,
            })
            return h(tag, rest, [hChild])
          },
        },
      },
    }
  })
})
