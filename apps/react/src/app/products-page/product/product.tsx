import './product.scss';

export interface ProductProps {
  product: Product;
}

export interface Product {
  id: number;
  title: string;
  description: string;
}

export function Product({ product: { title, description, id } }: ProductProps) {
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <h6 className="card-subtitle mb-2 text-muted">{description}</h6>
        {/* <a href="#" className="card-link">Card link</a> */}
        {/* <a href="#" className="card-link">Another link</a> */}
      </div>
    </div>
  );
}

export default Product;
