// src/components/Header.tsx
import { useNavigate } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

export default function Header() {
  const navigate = useNavigate();

  return (
    <header
      style={{
        width: "100%",
        backgroundColor: "#f3f3f3",
        padding: "12px 20px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          backgroundColor: "#fff",
          border: "1px solid #e5e5e5",
          padding: "14px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "28px",
          }}
        >
          <span
            onClick={() => navigate("/home")}
            style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              cursor: "pointer",
              userSelect: "none",
            }}
          >
            Market
          </span>

          <span
            onClick={() => navigate("/home")}
            style={{
              fontSize: "1rem",
              cursor: "pointer",
              fontWeight: "500",
            }}
          >
            Início
          </span>
        </div>

        <div
          style={{
            flex: 1,
            maxWidth: "420px",
          }}
        >
          <input
            type="text"
            placeholder="Buscar produtos..."
            disabled
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              outline: "none",
              fontSize: "0.95rem",
              backgroundColor: "#fff",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
          }}
        >
        <HomeIcon onClick={() => navigate('/home')} />

        <ShoppingCartIcon onClick={() => navigate('/cart')} />

        </div>
      </div>
    </header>
  );
}