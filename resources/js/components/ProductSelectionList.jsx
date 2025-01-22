import { useCallback, useState } from 'react';
import { Loader, Check } from 'lucide-react';
import useAxios from '../hooks/useAxios';

const ProductSelectionList = ({ products, setProducts, setToastMessage }) => {
    const [loadingProducts, setLoadingProducts] = useState(new Set());
    const { axios } = useAxios();

    const handleProductSelect = useCallback(async (product) => {
        if (loadingProducts.has(product.product_id)) return;

        setLoadingProducts(prev => new Set(prev).add(product.product_id));

        try {
            const isCurrentlySelected = products.selected.some(
                p => p.product_id === product.product_id
            );

            const endpoint = isCurrentlySelected ? '/delete-products-app' : '/save-products-app';

            await axios.post(endpoint, { products: [product] });

            setProducts(prev => {
                if (isCurrentlySelected) {
                    return {
                        selected: prev.selected.filter(p => p.product_id !== product.product_id),
                        not_selected: [...prev.not_selected, product]
                    };
                } else {
                    return {
                        selected: [...prev.selected, product],
                        not_selected: prev.not_selected.filter(p => p.product_id !== product.product_id)
                    };
                }
            });

            setToastMessage(isCurrentlySelected ?
                'Product removed successfully' :
                'Product added successfully'
            );
        } catch (error) {
            console.error('Error updating product:', error);
            setToastMessage(
                `Failed to ${isCurrentlySelected ? 'remove' : 'add'} product`
            );
        } finally {
            setLoadingProducts(prev => {
                const newSet = new Set(prev);
                newSet.delete(product.product_id);
                return newSet;
            });
        }
    }, [products, setProducts, setToastMessage, axios]);

    const renderProductList = (productList) => (
        <div className="space-y-3">
            {productList.map((product) => (
                <div
                    key={product.product_id}
                    className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:bg-gray-50"
                >
                    <div className="relative mr-3">
                        <button
                            onClick={() => handleProductSelect(product)}
                            disabled={loadingProducts.has(product.product_id)}
                            className={`
                                flex items-center justify-center w-5 h-5 rounded 
                                border transition-colors duration-200
                                ${products.selected.some(p => p.product_id === product.product_id) 
                                    ? 'bg-blue-500 border-blue-500' 
                                    : 'bg-white border-gray-300 hover:border-blue-500'}
                                disabled:cursor-not-allowed disabled:opacity-50
                            `}
                        >
                            {loadingProducts.has(product.product_id) ? (
                                <Loader className="w-3 h-3 animate-spin text-white" />
                            ) : products.selected.some(p => p.product_id === product.product_id) ? (
                                <Check className="w-3 h-3 text-white" />
                            ) : null}
                        </button>
                    </div>
                    <strong className="flex-1">{product.title || product.name}</strong><strong> Price : $ {product.price}</strong>
                </div>
            ))}
        </div>
    );

    return (
        <div className="p-6 bg-gray-50 overflow-auto">
            {/* Selected Products */}
            <div className="mb-8 max-h-[300px] overflow-y-auto">
                <h2 className="text-lg font-semibold text-blue-600 mb-3">
                    Selected Products
                </h2>
                {products.selected.length > 0 ? (
                    renderProductList(products.selected)
                ) : (
                    <p className="text-gray-500">No selected products.</p>
                )}
            </div>

            {/* Not Selected Products */}
            <div className="max-h-[300px] overflow-y-auto">
                <h2 className="text-lg font-semibold text-blue-600 mb-3">
                    Not Selected Products
                </h2>
                {products.not_selected.length > 0 ? (
                    renderProductList(products.not_selected)
                ) : (
                    <p className="text-gray-500">No unselected products.</p>
                )}
            </div>
        </div>
    );
};

export default ProductSelectionList;