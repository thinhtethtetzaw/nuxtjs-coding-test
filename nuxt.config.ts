// https://nuxt.com/docs/api/configuration/nuxt-config

import tailwindcss from "@tailwindcss/vite"

export default defineNuxtConfig({
	compatibilityDate: "2025-05-15",
	app: {
		head: {
			title: "Hotel Booking App",
			htmlAttrs: {
				lang: "en",
			},
		},
	},
	devtools: { enabled: true },

	components: {
		dirs: ["components"],
	},

	css: ["~/assets/css/main.css"],

	vite: {
		plugins: [tailwindcss()],
	},

	modules: ["@nuxt/image", "shadcn-nuxt"],
	shadcn: {
		prefix: "",
		/**
		 * Directory that the component lives in.
		 * @default "./components/ui"
		 */
		componentDir: "./components/ui",
	},
})
