<script lang="ts">
  export let title: string;
</script>

<div class="message">
  <div class="header">{title}</div>
  <div class="message-inner">
    <slot>No content was provided</slot>
  </div>
</div>

<style>
  .message {
    position: relative;
    background: var(--message-bg);
    width: fit-content;
    margin: 0.5rem auto;
    font-size: 1.2rem;
    border-radius: 15px;
    margin-bottom: 2rem;
  }

  .message-inner {
    padding: 0rem 2rem;
  }

  .message .header {
    width: 100%;
    text-align: center;
    font-weight: bold;
    padding: 0.5rem;
    border-radius: 15px 15px 0 0;
    background: var(--action-header-bg);
  }
</style>
