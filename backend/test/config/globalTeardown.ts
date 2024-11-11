export default async () => {
  const container = global.reusedContainer;

  if (container) {
    await container.stop();
  }
};
