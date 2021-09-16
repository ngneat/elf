import Product from './product/product';
import './products-page.scss';

const products = Array.from({ length: 10 }).map((_, i) => ({
  id: i,
  title: `Product ${i}`,
  description: 'lorem ipsum',
}));

export function ProductsPage() {
  return (
    <>
      <h1 className="text-2xl mb-2">Products</h1>

      <section className="flex flex-wrap gap-2">
        {products.map((product) => (
          <div className="w-3/12">
            <Product product={product} key={product.id} />
          </div>
        ))}
      </section>
    </>
  );
}

export default ProductsPage;
