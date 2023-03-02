<script lang="ts">
  export let signie: { name: string; emoji: string };
</script>

<div class="sign-icon">
  <div class="emoji-container">
    <i class="oma oma-pen emoji" />
    <i class="oma {signie.emoji} signie-emoji" />
  </div>
  <p>{signie.name}</p>
</div>

<style>
  .sign-icon {
    position: absolute;
    bottom: 0;
    left: 0;
    transform: translate(-50%, 50%);
  }
  .emoji-container {
    position: relative;
  }
  .emoji-container .signie-emoji {
    position: absolute;
    bottom: 0;
    right: 0;
  }
  .emoji {
    font-size: 2rem;
  }
  p {
    margin: 0;
    text-align: center;
    font-size: 1rem;
  }
</style>
