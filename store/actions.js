import types from "./mutation_types";
import Cookies from "js-cookie";
import axios from "./axios";
import Vue from 'vue'

const actions = {
  getMMData: function ({
    state,
    commit
  }, {
    resource,
    queryParams = null
  }) {
    return new Promise((resolve, reject) => {
      let load_resource = ''
      if (resource == 'stores') {
        load_resource = 'stores/list'
      } else {
        load_resource = resource
      }
      axios
        .get(load_resource + "?api_key=" + process.env.API_KEY, {
          params: queryParams
        })
        .then(response => {
          switch (resource) {
            case "":
              commit(types.SET_PROPERTY, {
                property: response.data
              });
              break;
            case "homepage":
              commit(types.SET_HOMEPAGE, {
                homepage: response.data
              });
              break;
            case "banners":
              commit(types.SET_BANNERS, {
                banners: response.data
              });
              break;
            case "galleries":
              commit(types.SET_REPOS, {
                repos: response.data
              });
              break;
            case "stores":
              commit(types.SET_STORES, {
                stores: response.data
              });
              break;
            case "promotions":
              commit(types.SET_PROMOTIONS, {
                promotions: response.data
              });
              break;
            case "events":
              commit(types.SET_EVENTS, {
                events: response.data
              });
              break;
            case "jobs":
              commit(types.SET_JOBS, {
                jobs: response.data
              });
              break;
            case "categories":
              commit(types.SET_CATEGORIES, {
                categories: response.data
              });
              break;
            case "pages":
              commit(types.SET_PAGES, {
                pages: response.data
              });
              break;
            case "news":
              commit(types.SET_NEWS, {
                news: response.data
              });
              break;
            case "hours":
              commit(types.SET_HOURS, {
                hours: response.data
              });
              break;
            case "contests":
              commit(types.SET_CONTESTS, {
                contests: response.data
              });
              break;
            case "popups":
              commit(types.SET_POPUPS, {
                popups: response.data
              });
              break;
          }
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  LOAD_SEO: function ({
    state,
    commit
  }, list) {
    return new Promise((resolve, reject) => {
      axios.get(process.env.MM_API_URL + "meta_data?path=" + list.url + "&api_key=" +
        process.env.API_KEY).then(response => {
        resolve(response);
      }).catch(error => {
        console.log("Data load error: " + error.message);
        reject(error);
      });
    })
  },
  LOAD_PAGE_DATA: function ({
    commit
  }, list) {
    return new Promise((resolve, reject) => {
      axios
        .get(list.url)
        .then(response => {
          // commit('SET_MALL_DATA', { list: response.data })
          resolve(response);
        })
        .catch(error => {
          console.log("Data load error: " + error.message);
          reject(error);
        });
    });
  },

};

export default actions;
