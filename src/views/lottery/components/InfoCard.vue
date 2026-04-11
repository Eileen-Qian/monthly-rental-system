<template>
  <div class="info-card">
    <p class="info-card__date">{{ siteData.date }}</p>
    <p class="info-card__place">
      {{ siteData.placeName }}-{{ siteData.vehicleType }}
    </p>
  </div>
</template>

<script setup>
defineProps({ siteData: Object })
</script>

<style scoped>
.info-card {
  display: inline-block;
  border: 1px solid #0d5c63;
  border-radius: 8px;
  padding: 20px 48px;
  text-align: center;
}
.info-card__date {
  font-size: 1.5rem;
  font-weight: 300;
  color: #0d5c63;
}
.info-card__place {
  font-size: 1rem;
  font-weight: 700;
  color: #237b7c;
  margin-top: 4px;
}
</style>
