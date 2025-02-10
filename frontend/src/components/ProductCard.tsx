import {
  Box,
  Heading,
  HStack,
  IconButton,
  Image,
  Text,
  DialogActionTrigger,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  Button,
  VStack,
  Input,
} from "@chakra-ui/react";
import { LuPencil, LuTrash } from "react-icons/lu";
import { useColorModeValue } from "./ui/color-mode";
import { useProductStore } from "@/store/product";
import { toaster, Toaster } from "./ui/toaster";
import { useState } from "react";
import { Product } from "@/store/product";

type ProductCardProps = {
  product: Product;
};

const ProductCard = ({ product }: ProductCardProps) => {
  const [updatedProduct, setUpdatedProduct] = useState<Product>(product);
  const [open, setOpen] = useState(false);

  const textColor = useColorModeValue("gray.600", "gray.200");
  const bg = useColorModeValue("white", "gray.800");

  const { deleteProduct, updateProduct } = useProductStore();
  const handleDeleteProduct = async (id: string) => {
    const { success, message } = await deleteProduct(id);

    if (!success) {
      toaster.create({
        title: "error",
        description: message,
        type: "error",
      });
    } else {
      toaster.create({
        title: "Success",
        description: message,
        type: "success",
      });
    }
  };
  const handleUpdateProduct = async (id: string, updatedProduct: Product) => {
    const { success } = await updateProduct(id, updatedProduct);
    if (!success) {
      toaster.create({
        title: "error",
        description: "Producted updated unsuccessfully",
        type: "error",
      });
    } else {
      toaster.create({
        title: "Success",
        description: "Producted updated successfully",
        type: "success",
      });
    }
  };

  return (
    <Box
      shadow="lg"
      rounded="lg"
      overflow="hidden"
      transition="all 0.3s"
      _hover={{ transform: "translateY(-5px)", shadow: "xl" }}
      bg={bg}
    >
      <Image src={product.image} alt={product.name} objectFit="cover" h="48" />
      <Box p={4}>
        <Heading as={"h3"} size={"md"} mb={2}>
          {product.name}
        </Heading>
        <Text fontWeight={"bold"} fontSize={"xl"} color={textColor} mb={4}>
          ${product.price}
        </Text>
        <HStack spaceX={2}>
          <IconButton colorPalette={"blue"} onClick={() => setOpen(true)}>
            <LuPencil />
          </IconButton>
          <IconButton
            colorPalette={"red"}
            onClick={() => handleDeleteProduct(product._id)}
          >
            <LuTrash />
          </IconButton>
        </HStack>
      </Box>

      <DialogRoot lazyMount open={open} onOpenChange={(e) => setOpen(e.open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <VStack>
              <Input
                placeholder="Product Name"
                name="name"
                value={updatedProduct.name}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    name: e.target.value,
                  })
                }
              />
              <Input
                placeholder="Product Price"
                name="price"
                type="number"
                value={updatedProduct.price}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    price: e.target.value,
                  })
                }
              />
              <Input
                placeholder="Image URL"
                name="image"
                value={updatedProduct.image}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    image: e.target.value,
                  })
                }
              />
            </VStack>
          </DialogBody>
          <DialogFooter>
            <DialogActionTrigger asChild>
              <Button variant="outline">Cancel</Button>
            </DialogActionTrigger>
            <DialogActionTrigger asChild>
              <Button
                onClick={() => handleUpdateProduct(product._id, updatedProduct)}
              >
                Save
              </Button>
            </DialogActionTrigger>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>

      <Toaster />
    </Box>
  );
};

export default ProductCard;
