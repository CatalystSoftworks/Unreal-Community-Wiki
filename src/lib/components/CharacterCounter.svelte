<script lang="ts">
    export let value: string;

    export let max: number;
</script>

<div class="counter muted xs" class:too-long={value.length > max}>
    {max - value.length} characters remaining
</div>

<style>
    .counter {
        margin-top: 0.5em;
    }

    .too-long {
        color: var(--error);
        opacity: 1;
    }
</style>
