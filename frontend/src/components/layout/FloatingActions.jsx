import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { whatsappLink } from "../../config/site";
import "../../styles/components/home/FloatingActions.css";

const FloatingActions = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  const openWhatsApp = () =>
    window.open(
      whatsappLink("Hi, I am interested in buying property. Please share details."),
      "_blank"
    );

  if (!isReady) return null;

  return (
    <div className="floating-actions">
      <button
        className="floating-btn floating-btn-whatsapp"
        onClick={openWhatsApp}
        aria-label="WhatsApp us"
      >
        <MessageCircle size={20} />
      </button>
    </div>
  );
};

export default FloatingActions;
