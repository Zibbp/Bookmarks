<template>
  <v-container>
    <Cards />
    <v-row justify="center">
      <v-dialog v-model="dialog" max-width="600px">
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="primary" dark v-bind="attrs" v-on="on"> + </v-btn>
        </template>
        <v-stepper v-model="e1">
          <v-stepper-header>
            <v-stepper-step :complete="e1 > 1" step="1">
              Enter URL
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step step="2"> Modify Details </v-stepper-step>
          </v-stepper-header>

          <v-stepper-items>
            <v-stepper-content step="1">
              <v-overlay :value="overlay" absolute>
                <v-progress-circular
                  indeterminate
                  size="64"
                ></v-progress-circular>
              </v-overlay>
              <v-text-field v-model="url" label="URL" required></v-text-field>

              <v-btn color="primary" class="float-right" @click="processUrl">
                Continue
              </v-btn>

              <v-btn class="float-right" text @click="dialog = false">
                Cancel
              </v-btn>
            </v-stepper-content>

            <v-stepper-content step="2">
              <v-row>
                <v-col cols="12" sm="12" md="12">
                  <v-text-field
                    label="Title"
                    :value="form.title"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="12" md="12">
                  <v-textarea
                    name="description"
                    label="Description"
                    :value="form.description"
                  ></v-textarea>
                </v-col>

                <v-col cols="12" sm="12" md="12">
                  <v-combobox
                    v-model="select"
                    :items="items"
                    label="Tags"
                    multiple
                    chips
                  ></v-combobox>
                </v-col>
              </v-row>

              <v-btn color="primary" class="float-right" @click="submit">
                Continue
              </v-btn>

              <v-btn class="float-right" text @click="dialog = false">
                Cancel
              </v-btn>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-dialog>
    </v-row>
    <v-snackbar v-model="snackbar" :color="color" :timeout="timeout">
      {{ text }}

      <template v-slot:action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import Cards from "../components/cards";
import Card from "../components/card";

export default {
  data() {
    return {
      dialog: false,
      e1: 1,
      url: "",
      form: {
        title: "",
        description: "",
        tags: "",
        image: "",
        url: "",
      },
      items: ["Programming", "Design", "Vue", "Vuetify"],
      select: [],
      overlay: false,
      snackbar: false,
      timeout: 2000,
      text: "URL not found",
      color: "red",
    };
  },
  methods: {
    async processUrl() {
      if (this.url == "") {
      } else {
        try {
          this.overlay = true;
          var res = await this.$axios.post(
            "http://localhost:3000/api/bookmarks/scrape",
            {
              url: this.url,
            }
          );
          this.overlay = false;
          this.form.title = res.data.ogTitle;
          this.form.description = res.data.description;
          this.form.image = res.data.ogImage;
          this.form.url = this.url;
          this.url = "";
          this.e1 = 2;
        } catch (error) {
          console.log(error);
          this.overlay = false;
          this.snackbar = true;
          this.e1 = 1;
        }
      }
    },
    async submit() {
      // (this.dialog = false), (this.e1 = 1);
      try {
        var res = await this.$axios.post(
          "http://localhost:3000/api/bookmarks",
          {
            title: this.form.title,
            description: this.form.description,
            tags: this.select,
            image: this.form.image,
            url: this.form.url,
          }
        );

        console.log(res);
        this.dialog = false;
        this.form.title = "";
        this.form.description = "";
        this.select = "";
        this.form.image = "";
        this.form.url = "";
        this.e1 = 1;
      } catch (error) {
        console.log(error);
        this.dialog = true;
        this.e1 = 2;
      }
    },
  },
};
</script>
