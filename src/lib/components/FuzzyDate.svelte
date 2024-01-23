<script lang="ts">
    import format from "date-fns/formatDistanceToNow/index.js";

    /** The date to format. */
    export let date: number | string | Date;

    $: d = new Date(date);
    $: fuzzyDate = format(d, { addSuffix: true });
</script>

<date time={d.toLocaleString()} title={d.toLocaleString()} {...$$restProps}>
    {fuzzyDate}
</date>
