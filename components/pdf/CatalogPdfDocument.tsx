import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { Product } from '@/core/entities/Product';
import { Brand } from '@/core/entities/Brand';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30, // standard A4 padding
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#2563eb',
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40, // fixed height for header so content area is predictable
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748b',
  },
  content: {
    flex: 1, // take remaining space
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'flex-start',
  },
  card: {
    width: '48%',
    height: '38%', // Significantly reduced to ~11cm to ensure 4 cards neatly fit
    marginBottom: '2%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    flexDirection: 'column',
    backgroundColor: '#f8fafc',
  },
  imageContainer: {
    height: '35%', // Reduced image space to preserve room for text characteristics
    marginBottom: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 6,
    padding: 4,
  },
  image: {
    objectFit: 'contain',
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  brandText: {
    fontSize: 10,
    color: '#3b82f6',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  productName: {
    fontSize: 12, // Even smaller text
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 2, // reduced margin to 2
    height: 28, // Tighter height for 2 lines
  },
  specsBox: {
    flex: 1,
    marginTop: 2,
    paddingTop: 4, // reduced padding from 6 to 4
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  specRow: {
    flexDirection: 'row',
    marginBottom: 1, // reduced from 2 to 1 (tighter rows)
  },
  specLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#475569',
    width: '45%', // Increased from 35% to give "Almacenamiento" more room
  },
  specValue: {
    fontSize: 9,
    color: '#334155',
    width: '55%', // Decreased from 65% to balance
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: 10,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 10,
  },
});

interface CatalogPdfDocumentProps {
  products: Product[];
  brands: Brand[];
}

// Helper to divide the array into chunks of the specified size (e.g. 4)
const chunkArray = <T,>(arr: T[], size: number): T[][] => {
  return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );
};

export const CatalogPdfDocument: React.FC<CatalogPdfDocumentProps> = ({ products, brands }) => {
  const getBrandName = (brandIdOrObj: string | Brand): string => {
    if (typeof brandIdOrObj === 'string') {
      const brandObj = brands.find((b) => b.id === brandIdOrObj);
      return brandObj ? brandObj.name : 'Desconocida';
    } else if (brandIdOrObj && 'name' in brandIdOrObj) {
      return (brandIdOrObj as Brand).name;
    }
    return 'Desconocida';
  };

  // We chunk the products so every page receives exactly a maximum of 4 products.
  const productChunks = chunkArray(products, 4);

  return (
    <Document>
      {productChunks.map((chunk, pageIndex) => (
        <Page key={`page-${pageIndex}`} size="A4" style={styles.page} wrap={false}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Catálogo de Celulares</Text>
              <Text style={styles.subtitle}>CelredSoft - Listado Oficial</Text>
            </View>
            <Text style={styles.subtitle}>{new Date().toLocaleDateString('es-CO')}</Text>
          </View>

          <View style={styles.content}>
            {chunk.map((product) => {
              const hasSpecs = product.specs && (
                product.specs.processor ||
                product.specs.ram ||
                product.specs.storage ||
                product.specs.screen ||
                product.specs.battery ||
                product.specs.camera
              );

              return (
                <View key={product.id || product.name} style={styles.card}>
                  <View style={styles.imageContainer}>
                    {product.imageUrl ? (
                      <Image source={product.imageUrl} style={styles.image} />
                    ) : (
                      <Text style={{ fontSize: 10, color: '#94a3b8' }}>Sin imagen</Text>
                    )}
                  </View>
                  
                  <View style={styles.infoContainer}>
                    <Text style={styles.brandText}>{getBrandName(product.brand)}</Text>
                    <Text style={styles.productName}>
                      {product.name.length > 45 ? product.name.substring(0, 42) + '...' : product.name}
                    </Text>

                    {hasSpecs ? (
                      <View style={styles.specsBox}>
                        {product.specs?.processor && (
                          <View style={styles.specRow}>
                             <Text style={styles.specLabel}>Procesador:</Text>
                             <Text style={styles.specValue}>{product.specs.processor}</Text>
                          </View>
                        )}
                        {product.specs?.ram && (
                          <View style={styles.specRow}>
                             <Text style={styles.specLabel}>RAM:</Text>
                             <Text style={styles.specValue}>{product.specs.ram}</Text>
                          </View>
                        )}
                        {product.specs?.storage && (
                          <View style={styles.specRow}>
                             <Text style={styles.specLabel}>Almacenamiento:</Text>
                             <Text style={styles.specValue}>{product.specs.storage}</Text>
                          </View>
                        )}
                        {product.specs?.screen && (
                          <View style={styles.specRow}>
                             <Text style={styles.specLabel}>Pantalla:</Text>
                             <Text style={styles.specValue}>{product.specs.screen}</Text>
                          </View>
                        )}
                        {product.specs?.battery && (
                          <View style={styles.specRow}>
                             <Text style={styles.specLabel}>Batería:</Text>
                             <Text style={styles.specValue}>{product.specs.battery}</Text>
                          </View>
                        )}
                        {product.specs?.camera && (
                          <View style={styles.specRow}>
                             <Text style={styles.specLabel}>Cámara:</Text>
                             <Text style={styles.specValue}>{product.specs.camera}</Text>
                          </View>
                        )}
                      </View>
                    ) : (
                      <View style={[styles.specsBox, { justifyContent: 'center', alignItems: 'center' }]}>
                         <Text style={{ fontSize: 10, color: '#94a3b8', fontStyle: 'italic', marginTop: 10 }}>Sin características adicionales</Text>
                      </View>
                    )}
                  </View>
                </View>
              );
            })}
          </View>

          <Text style={styles.footer} render={({ pageNumber, totalPages }) => (
            `Catálogo generado por CelredSoft - Página ${pageNumber} de ${totalPages}`
          )} fixed />
        </Page>
      ))}
    </Document>
  );
};
