const importPageComponent = async (name: string) => {
  const { default: view } = await import('../views/routes/' + name);
  return view;
};

export default importPageComponent;
