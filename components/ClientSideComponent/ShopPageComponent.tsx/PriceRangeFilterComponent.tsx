// components/PriceRangeFilter.tsx
import { Range, getTrackBackground } from "react-range";
import { FC } from "react";

interface PriceRangeFilterProps {
  price: number[];
  setPrice: (value: number[]) => void;
}

const STEP = 1;
const MIN = 0;
const MAX = 100;

const PriceRangeFilter: FC<PriceRangeFilterProps> = ({ price, setPrice }) => {
  return (
    <div className="w-full p-4">
      <h4 className="text-sm font-medium mb-2">Price Range</h4>
      <Range
        values={price}
        step={STEP}
        min={MIN}
        max={MAX}
        onChange={(values: number[]) => setPrice(values)}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: "6px",
              width: "100%",
              borderRadius: "4px",
              background: getTrackBackground({
                values: price,
                colors: ["#ccc", "#0d6efd", "#ccc"],
                min: MIN,
                max: MAX,
              }),
            }}
          >
            {children}
          </div>
        )}
        renderThumb={({ props, isDragged }) => {
          // Destructure key from props and spread the rest
          const { key, ...restProps } = props as any;
          const index = restProps["data-index"];
          return (
            <div key={key} {...restProps}
              className={`w-4 h-4 rounded-full shadow flex items-center justify-center ${
                isDragged ? "bg-blue-700" : "bg-blue-500"
              }`}
            >
              <div className="absolute top-8 text-xs font-medium text-gray-700">
                ${price[index]}
              </div>
            </div>
          );
        }}
      />
      <div className="flex justify-between text-sm mt-2">
        <span>${price[0]}</span>
        <span>${price[1]}</span>
      </div>
    </div>
  );
};

export default PriceRangeFilter;
