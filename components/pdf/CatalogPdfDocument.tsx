import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { Product } from '@/core/entities/Product';
import { Brand } from '@/core/entities/Brand';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#2563eb',
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  card: {
    width: '48%',
    marginBottom: 20,
    marginRight: '2%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    flexDirection: 'column',
    backgroundColor: '#f8fafc',
  },
  imageContainer: {
    height: 120,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 4,
  },
  image: {
    objectFit: 'contain',
    width: '100%',
    height: '100%',
  },
  brandText: {
    fontSize: 10,
    color: '#3b82f6',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  specsBox: {
    marginTop: 5,
    paddingTop: 5,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  specRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  specLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#475569',
    width: '35%',
  },
  specValue: {
    fontSize: 9,
    color: '#334155',
    width: '65%',
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

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Catálogo de Productos</Text>
            <Text style={styles.subtitle}>CelredSoft - Listado Oficial</Text>
          </View>
          <Text style={styles.subtitle}>{new Date().toLocaleDateString('es-CO')}</Text>
        </View>

        <View style={styles.grid}>
          {products.map((product) => {
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
                
                <Text style={styles.brandText}>{getBrandName(product.brand)}</Text>
                <Text style={styles.productName}>{product.name}</Text>

                {hasSpecs && (
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
                )}
              </View>
            );
          })}
        </View>

        <Text style={styles.footer} render={({ pageNumber, totalPages }) => (
          `Catálogo generado por CelredSoft - Página ${pageNumber} de ${totalPages}`
        )} fixed />
      </Page>
    </Document>
  );
};
