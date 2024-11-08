export const getModalHeaderMode = (mode) => {
    switch (mode) {
      case "view":
        return "bg-primary text-white";
      case "edit":
        return "bg-warning text-white";
      default:
        return "bg-info text-dark";
    }
  };