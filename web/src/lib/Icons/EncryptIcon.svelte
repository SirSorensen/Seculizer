<script lang="ts">
  export let encryptKey: { id: string; emoji: string };
</script>

<div class="encrypt-icon">
  <i class="oma oma-locked emoji" />
  <div class="id-container">
    <p>{encryptKey.id}</p>
    <i class="oma {encryptKey.emoji} encrypt-emoji" />
  </div>
</div>

<style>
  .encrypt-icon {
    position: absolute;
    bottom: 0;
    right: 0;
    transform: translate(40%, 60%);
  }
  .id-container {
    position: relative;
  }
  .id-container .encrypt-emoji {
    position: absolute;
    bottom: 0;
    right: 0;
    transform: translate(75%, 0);
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
