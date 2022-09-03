<template>
	<div style="margin:1%">
		<v-radio-group v-model="selection" row>
			<v-radio label="Copy code" value="copyCode"></v-radio>
			<v-radio label="Copy table" value="copyTable"></v-radio>
			<v-radio label="Prettify" value="prettify"></v-radio>
		</v-radio-group>
		<div v-if="selection == 'copyCode'">
			<v-row no-gutters>
				<v-col cols="6">
					<v-text-field v-model="source" label="Source" hide-details></v-text-field>
				</v-col>
				<v-col cols="6">
					<v-text-field v-model="destination" label="Destination" hide-details></v-text-field>
				</v-col>
			</v-row>
			<v-textarea v-model="copyCode.input" label="Input" rows="10" hide-details></v-textarea>
			<div class="d-flex justify-center">
				<v-btn @click="doCopyCode" class="my-2" color="primary">Go</v-btn>
			</div>
			<v-textarea v-model="copyCode.output" label="Output" rows="10" hide-details readonly></v-textarea>
		</div>
		<div v-if="selection == 'copyTable'">
			<v-row no-gutters>
				<v-col cols="6">
					<v-text-field v-model="source" label="Source" hide-details></v-text-field>
				</v-col>
				<v-col cols="6">
					<v-text-field v-model="destination" label="Destination" hide-details></v-text-field>
				</v-col>
			</v-row>
			<v-textarea v-model="copyTable.input" label="Input" rows="10" hide-details></v-textarea>
			<div class="d-flex justify-center">
				<v-btn @click="doCopyTable" class="my-2" color="primary">Go</v-btn>
			</div>
			<v-textarea v-model="copyTable.output" label="Output" rows="10" hide-details readonly></v-textarea>
			<v-textarea v-model="logTable.output" label="Output" rows="10" hide-details readonly></v-textarea>
		</div>
		<div v-else-if="selection == 'prettify'">
			<v-textarea v-model="prettify.input" label="Input" rows="10" hide-details></v-textarea>
			<div class="d-flex justify-center">
				<v-btn @click="doPrettify" class="my-2" color="primary">Go</v-btn>
			</div>
			<v-textarea v-model="prettify.output" label="Output" rows="10" hide-details readonly></v-textarea>
		</div>
		<v-snackbar v-model="snackbar.value" timeout="2000">
			{{ snackbar.text }}
			<template v-slot:actions>
				<v-btn @click="snackbar.value = false">
					<v-icon>mdi-close</v-icon>
				</v-btn>
			</template>
		</v-snackbar>
	</div>
</template>

<script>
export default {
	data: () => ({
		selection: null,
		source: null,
		destination: null,
		snackbar: {
			value: false,
			text: ""
		},
		copyCode: {
			input: null,
			output: null
		},
		copyTable: {
			input: null,
			output: null
		},
		logTable: {
			output: null,
			template: `
CREATE TABLE logTemplate (
	id BIGINT(20) NOT NULL AUTO_INCREMENT,
	created TIMESTAMP NULL DEFAULT NULL,
	creatorId BIGINT(20) UNSIGNED NULL DEFAULT NULL,
	creator LONGTEXT NULL DEFAULT NULL CHECK (json_valid(creator)),
	type VARCHAR(32) NOT NULL,
	entityId BIGINT(20) UNSIGNED NULL DEFAULT NULL,
	pre LONGTEXT NULL DEFAULT NULL CHECK (json_valid(pre)),
	post LONGTEXT NULL DEFAULT NULL CHECK (json_valid(post)),
	PRIMARY KEY (id),
	INDEX logTemplate_foreignKey_creatorId (creatorId),
	INDEX logTemplate_foreignKey_entityId (entityId),
	CONSTRAINT logTemplate_foreignKey_creatorId FOREIGN KEY (creatorId) REFERENCES person (id) ON UPDATE CASCADE ON DELETE SET NULL,
	CONSTRAINT logTemplate_foreignKey_entityId FOREIGN KEY (entityId) REFERENCES template (id) ON UPDATE CASCADE ON DELETE SET NULL
)
COLLATE='utf8mb4_unicode_ci'
ENGINE=InnoDB
AUTO_INCREMENT=1;
`
		},
		prettify: {
			input: null,
			output: null
		}
	}),
	methods: {
		doCopyCode() {
			try {
				let source = this.source;
				source = (source.charAt(0) + "").toUpperCase() + source.substring(1);
				let sourceText = (source.charAt(0) + "").toLowerCase() + source.substring(1);
				let destination = this.destination;
				destination = (destination.charAt(0) + "").toUpperCase() + destination.substring(1);
				let destinationText = (destination.charAt(0) + "").toLowerCase() + destination.substring(1);
				this.copyCode.output = this.copyCode.input //
					.replaceAll(source, destination) //
					.replaceAll(sourceText, destinationText);
				navigator.clipboard.writeText(this.copyCode.output);
				this.snackbar = { value: true, text: "Done" };
			} catch (exception) {
				this.snackbar = { value: true, text: "Error" };
			}
		},
		doCopyTable() {
			try {
				let source = this.source;
				let sourceText = (source.charAt(0) + "").toLowerCase() + source.substring(1);
				let destination = this.destination;
				let destinationText = (destination.charAt(0) + "").toLowerCase() + destination.substring(1);
				this.copyTable.output = this.copyTable.input //
					.replaceAll(/ COLLATE 'utf8mb4_unicode_ci'/g, "") //
					.replaceAll(/ COLLATE 'utf8mb4_bin'/g, "") //
					.replaceAll(/AUTO_INCREMENT=[0-9]+/g, "AUTO_INCREMENT=1") //
					.replaceAll(source, destination)
					.replaceAll(sourceText, destinationText);
				this.logTable.output = this.logTable.template //
					.replaceAll("Template", destination)
					.replaceAll("template", destinationText);
				navigator.clipboard.writeText(this.copyTable.output + this.logTable.output);
				this.snackbar = { value: true, text: "Done" };
			} catch (exception) {
				this.snackbar = { value: true, text: "Error" };
			}
		},
		doPrettify() {
			try {
				this.prettify.output = JSON.stringify(JSON.parse(this.prettify.input), null, 4);
				navigator.clipboard.writeText(this.prettify.output);
				this.snackbar = { value: true, text: "Done" };
			} catch (exception) {
				this.snackbar = { value: true, text: "Error" };
			}
		}
	}
};
</script>
