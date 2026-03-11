import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { Product } from '@/core/entities/Product';
import { Brand } from '@/core/entities/Brand';

// A4 sheet is 595 x 842 points.
// Padding: 30pt. Usable area: 535 x 782.
// Header = 60pt. Footer = 30pt. 
// Usable space for grid = 692pt.
// 2 rows max: height of each card = 330pt. (330*2 = 660, leaving 32pt for vertical gap)
// Width: 535pt. 2 columns: width of card = 255pt. (255*2 = 510, leaving 25pt for horizontal gap)

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30, // 30pt padding all around
  },
  header: {
    height: 50, // Increased from 40 to accommodate font sizes and line heights
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#2563eb',
    paddingBottom: 8, // Added padding to push the line further down
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  content: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: 255, // Fixed width in points
    height: 330, // Fixed height in points
    marginBottom: 20, // Fixed margin
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    overflow: 'hidden', // prevent any content from expanding the card
  },
  imageContainer: {
    height: 120, // Fixed image area height
    width: '100%',
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
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
  },
  brandText: {
    fontSize: 9,
    color: '#3b82f6',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  productName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f172a',
    height: 28, // Max 2 lines using fixed height
    marginBottom: 8,
  },
  specsBox: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 8,
  },
  specRow: {
    flexDirection: 'row',
    marginBottom: 4,
    alignItems: 'flex-start',
  },
  specLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#475569',
    width: 80, // Increased width to ensure "Almacenamiento:" fits without hyphenation/wrapping
  },
  specValue: {
    fontSize: 9,
    color: '#334155',
    flex: 1,
  },
  noSpecsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    marginTop: 8,
  },
  noSpecsText: {
    fontSize: 10,
    color: '#94a3b8',
    fontStyle: 'italic',
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

  // Divide array into exact chunks of 4.
  const productChunks = chunkArray(products, 4);

  return (
    <Document>
      {productChunks.map((chunk, pageIndex) => (
        <Page key={`page-${pageIndex}`} size="A4" style={styles.page} wrap={false}>
          <View style={styles.header} wrap={false}>
            <View>
              <Text style={styles.title}>Catálogo de Celulares</Text>
              <Text style={styles.subtitle}>CelredSoft - Listado Oficial</Text>
            </View>
            <Text style={styles.subtitle}>{new Date().toLocaleDateString('es-CO')}</Text>
          </View>

          <View style={styles.content} wrap={false}>
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
                <View key={product.id || product.name} style={styles.card} wrap={false}>
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
                      {product.name.length > 50 ? product.name.substring(0, 47) + '...' : product.name}
                    </Text>

                    {hasSpecs ? (
                      <View style={styles.specsBox}>
                        {product.specs?.processor && (
                          <View style={styles.specRow}>
                            <Text style={styles.specLabel}>Procesador:</Text>
                            <Text style={styles.specValue}>
                                {product.specs.processor.length > 35 ? product.specs.processor.substring(0,32) + '...' : product.specs.processor}
                            </Text>
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
                            <Text style={styles.specValue}>
                                {product.specs.screen.length > 35 ? product.specs.screen.substring(0,32) + '...' : product.specs.screen}
                            </Text>
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
                            <Text style={styles.specValue}>
                                {product.specs.camera.length > 35 ? product.specs.camera.substring(0,32) + '...' : product.specs.camera}
                            </Text>
                          </View>
                        )}
                      </View>
                    ) : (
                      <View style={styles.noSpecsContainer}>
                        <Text style={styles.noSpecsText}>Sin características adicionales</Text>
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
