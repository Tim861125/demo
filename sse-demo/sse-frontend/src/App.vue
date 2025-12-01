<template>
  <div>
    <h2>SSE 訊息：</h2>
    <p v-for="(msg, i) in messages" :key="i">{{ msg }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return { messages: [] };
  },
  mounted() {
    const eventSource = new EventSource("http://localhost:5119/sse/stream");

    eventSource.onmessage = (e) => {
      this.messages.push(e.data);
    };

    eventSource.onerror = () => {
      console.log("SSE 連線中斷");
      eventSource.close();
    };
  },
};
</script>

<style>
body {
  font-family: sans-serif;
}
</style>
