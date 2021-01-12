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
        <div class="votes">
          <p class="arrow" @click="() => vote(post.id, 'up')">↑</p>
          <p>{{ post.points }}</p>
          <p class="arrow" @click="() => vote(post.id, 'down')">↓</p>
        </div>
        <div class="postcontent">
          <small>Posted by {{ post.creator.username }} 8 hours ago</small>
          <RouterLink :to="`/posts/${post.id}`" class="title">
            <h2>{{ post.title }}</h2>
          </RouterLink>
          <p>
            {{ post.textSnippet }}...<RouterLink :to="`/posts/${post.id}`"
              >See More</RouterLink
            >
          </p>
        </div>
        <div v-if="me && post.creator.id === me.id" class="deleteContainer">
          <Button
            value="Delete"
            color="orange"
            :click="() => deletePost(post.id)"
          />
        </div>
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
import { voteGQL } from '../graphql/VoteGraphQL';
import { deletePostGQL } from '../graphql/DeletePostGraphQL';
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
        query: gql(postsGQL),
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

      document.location.reload();
    },
    async deletePost(id) {
      await this.$apollo.mutate({
        mutation: gql(deletePostGQL),
        variables: { id },
      });
    },
    async vote(id, value) {
      await this.$apollo.mutate({
        mutation: gql(voteGQL),
        variables: {
          post: id,
          value: value === 'up' ? 1 : -1,
        },
      });
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
    background-color: #fff;
    border: 1px solid #cccccc;
    border-radius: 4px;
    padding: 20px 10px;
    margin: 20px 0;
    display: flex;

    .votes {
      margin-right: 10px;

      .arrow {
        cursor: pointer;
        margin: 3px 0 6px 0;
      }
    }

    .postcontent {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      text-align: left;

      .title {
        color: #222222;
        text-decoration: none;
      }
    }
  }
}

.deleteContainer {
  margin-left: auto;
  display: flex;
  align-items: flex-end;
}
</style>
