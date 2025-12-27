-- Migration: Create products table
-- Migrates products from localStorage to Supabase

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  image TEXT NOT NULL,
  description TEXT,
  stock INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for category filtering
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Everyone can view active products
CREATE POLICY "Anyone can view active products" ON products
  FOR SELECT
  USING (is_active = true);

-- Admins can do everything (using has_role function if exists, otherwise authenticated users)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'has_role') THEN
    EXECUTE 'CREATE POLICY "Admins can manage products" ON products
      FOR ALL
      USING (has_role(auth.uid(), ''admin''::app_role))';
  ELSE
    -- Fallback: authenticated users can manage (check role in application)
    EXECUTE 'CREATE POLICY "Authenticated users can manage products" ON products
      FOR ALL
      USING (auth.role() = ''authenticated'')';
  END IF;
END $$;

-- Service role can do everything
CREATE POLICY "Service role full access on products" ON products
  FOR ALL
  USING (auth.role() = 'service_role');

-- Create trigger for updated_at
CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert initial products (from oceaneData.ts)
INSERT INTO products (id, name, category, price, image, description, stock, is_active) VALUES
  (1, 'Larme du Lagon', 'Colliers', 1250, 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800', 'Pendentif perle de Tahiti solitaire, 10mm, montée sur or blanc 18k.', 10, true),
  (2, 'Nuit Étoilée', 'Boucles d''oreilles', 890, 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800', 'Paire de perles baroques aux reflets aubergine, crochets or jaune.', 15, true),
  (3, 'Atoll Royal', 'Bracelets', 2100, 'https://images.unsplash.com/photo-1602752250055-567f4a72758c?auto=format&fit=crop&q=80&w=800', 'Bracelet cuir et perles multiples, fermoir en argent massif.', 8, true),
  (4, 'Profondeur Océan', 'Bagues', 1540, 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800', 'Perle noire parfaite de 11mm sur anneau pavé de diamants.', 5, true),
  (5, 'Souffle de Moorea', 'Colliers', 3400, 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?auto=format&fit=crop&q=80&w=800', 'Rang de perles multicolores (gris, vert, paon), fermoir invisible.', 3, true),
  (6, 'Éclat Solaire', 'Boucles d''oreilles', 650, 'https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?auto=format&fit=crop&q=80&w=800', 'Perles Keshi dorées, design minimaliste et moderne.', 20, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  image = EXCLUDED.image,
  description = EXCLUDED.description;

-- Reset the sequence to continue after existing IDs
SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));
