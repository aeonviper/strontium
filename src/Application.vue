<template>
	<v-app>
		<v-main>
			<Dashboard />
		</v-main>
	</v-app>
</template>

<script>
import Dashboard from "./components/Dashboard.vue";

export default {
	name: "Application",

	components: {
		Dashboard
	},

	data: () => ({
		//
	})
};
</script>
