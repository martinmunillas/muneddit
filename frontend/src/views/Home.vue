<template>
  <div class="home">
    <div class="posts" v-if="posts">
      <div class="postForm" v-if="me">
        <form @submit.prevent="createPost">
          <h2>Create Post</h2>
          <Spacer />
          <InputField
            name="title"
            v-model="form.title"
            placeholder="Title..."
            color="grey"
          />
          <Spacer />
          <InputField
            name="text"
            placeholder="Description..."
            v-model="form.text"
            :textarea="true"
            color="grey"
          />
          <Spacer />

          <Button value="Post" type="submit" color="orange" />
        </form>
      </div>
      <div v-for="post in posts.posts" :key="post.id" class="post">
        <RouterLink :to="`/posts/${post.id}`">
          <small>Posted by {{ post.creator.username }} 8 hours ago</small>
          <h2>{{ post.title }}</h2>
          <p>{{ post.textSnippet }}...</p>
        </RouterLink>
      </div>
      <Button
        v-if="posts.hasMore"
        :click="getMorePosts"
        value="Load"
        color="orange"
      />
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag';
import { postsGQL } from '../graphql/PostsGraphQL';
import { meGQL } from '../graphql/MeGraphQl';
import { createPostGQL } from '../graphql/CreatePostGraphQL';
import InputField from '../components/InputField.vue';
import Button from '../components/Button.vue';
import Spacer from '../components/Spacer.vue';
export default {
  name: 'Home',
  components: { Button, InputField, Spacer },
  apollo: {
    me: gql(meGQL),
  },
  data() {
    return {
      posts: {},
      form: {
        title: '',
        text: '',
      },
    };
  },
  async mounted() {
    const res = await this.$apollo.mutate({
      mutation: gql(postsGQL),
      variables: { limit: 10 },
    });

    this.posts = res.data.posts;
  },
  methods: {
    async getMorePosts() {
      const res = await this.$apollo.query({
        mutation: gql(postsGQL),
        variables: {
          limit: 10,
          cursor: this.posts.posts[this.posts.posts.length - 1].createdAt,
        },
      });

      this.posts.posts = [...this.posts.posts, ...res.data.posts.posts];
      this.posts.hasMore = res.data.posts.hasMore;
    },
    async createPost() {
      await this.$apollo.mutate({
        mutation: gql(createPostGQL),
        variables: this.form,
      });
      this.form.title = '';
      this.form.text = '';

      const res = await this.$apollo.update({
        mutation: gql(postsGQL),
        variables: {
          limit: 10,
          cursor: this.posts.posts[this.posts.posts.length - 1].createdAt,
        },
      });

      this.posts.posts = [...this.posts.posts, ...res.data.posts.posts];
      this.posts.hasMore = res.data.posts.hasMore;
    },
  },
};
</script>

<style lang="scss" scoped>
.posts {
  margin: 50px auto;
  max-width: 80vw;
  width: 800px;

  .postForm {
    background-color: #fff;
    border: 1px solid #cccccc;
    border-radius: 4px;
    padding: 20px 10px;

    form {
      display: flex;
      flex-direction: column;
      align-items: flex-start;

      button {
        align-self: flex-end;
        width: 100px;
      }
    }
  }

  .post {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    text-align: left;

    background-color: #ffffff;
    border: 1px solid #cccccc;
    border-radius: 4px;
    margin: 20px 0;
    padding: 10px;

    a {
      color: #222222;
      text-decoration: none;
    }
  }
}
</style>
