import { Product } from '@/core/entities/Product';
import { Brand } from '@/core/entities/Brand';

function resolveBrandName(product: Product, brands: Brand[]): string {
    if (typeof product.brand === 'object' && product.brand !== null) {
        return (product.brand as Brand).name || 'Sin Marca';
    }
    if (typeof product.brand === 'string') {
        return brands.find((b) => b.id === product.brand)?.name ?? 'Sin Marca';
    }
    return product.brand ? String(product.brand) : 'Sin Marca';
}

export async function exportProductsToExcel(products: Product[], brands: Brand[]): Promise<void> {
    try {
        const ExcelJS = (await import('exceljs')).default;
        const { saveAs } = await import('file-saver');

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Inventario');

        worksheet.columns = [
            { header: 'Marca', key: 'marca', width: 20 },
            { header: 'Nombre', key: 'nombre', width: 35 },
            { header: 'Precio', key: 'precio', width: 15 },
            { header: 'Stock', key: 'stock', width: 10 },
        ];

        const headerRow = worksheet.getRow(1);
        headerRow.height = 25;
        headerRow.font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
        headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F2937' } };
        headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

        const dataToExport = products
            .map((product) => ({
                marca: resolveBrandName(product, brands),
                nombre: product.name,
                precio: product.price,
                stock: product.stock,
            }))
            .sort((a, b) => a.marca.localeCompare(b.marca));

        dataToExport.forEach((item) => {
            const row = worksheet.addRow(item);
            row.getCell('precio').alignment = { vertical: 'middle', horizontal: 'right' };
            row.getCell('stock').alignment = { vertical: 'middle', horizontal: 'center' };
            row.getCell('precio').numFmt = '"$"#,##0.00';
        });

        worksheet.eachRow((row) => {
            row.eachCell((cell) => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                };
                if (!cell.alignment) {
                    cell.alignment = { vertical: 'middle', horizontal: 'left' };
                }
            });
        });

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        saveAs(blob, 'Inventario_Celulares_Detallado.xlsx');
    } catch (error) {
        console.error('Error generating Excel:', error);
        alert('No se pudo generar el Excel. Intente nuevamente.');
    }
}
