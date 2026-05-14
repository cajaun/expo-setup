import { forwardRef, useMemo } from 'react';
import { View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { AnimationSettingsProvider } from '../animation/animation-settings';
import { Button } from './button';
import { CloseIcon, ToastIcon } from './icons';
import type { TextRef, ViewRef } from '../types';
import { ToastText } from './text';
import { useThemeColor } from '../styles';
import * as ToastPrimitive from '../primitives/toast.primitive';
import type { ToastComponentProps } from '../types';
import { cn, createContext } from '../utils';
import { useToastConfig } from '../provider/toast-config.context';
import { useToastRootAnimation } from '../animation/toast.animation';
import { DISPLAY_NAME } from './toast.constants';
import { useVerticalPlaceholderStyles } from './toast.hooks';
import {
  getToastThemeStyles,
  toastClassNames,
  toastStyleSheet,
  toastTextSizeStyles,
  toastVariantColorsByScheme,
} from '../styles';
import type {
  DefaultToastProps,
  ToastOptions,
  ToastActionProps,
  ToastCloseProps,
  ToastContextValue,
  ToastDescriptionProps,
  ToastRootProps,
  ToastTitleProps,
} from '../types';

const AnimatedToastRoot = Animated.createAnimatedComponent(ToastPrimitive.Root);

const [ToastProvider, useToast] = createContext<ToastContextValue>({
  name: 'ToastContext',
});

const defaultIconByVariant = {
  success: 'checkmark.circle.fill',
  warning: 'exclamationmark.triangle.fill',
  danger: 'exclamationmark.circle.fill',
  info: 'info.circle.fill',
} as const;

function getToastColorScheme(toastOptions: ToastOptions | undefined) {
  return toastOptions?.colorScheme ?? 'light';
}

function getVariantOptions(
  toastOptions: ToastOptions | undefined,
  variant: ToastRootProps['variant']
) {
  return variant ? toastOptions?.variants?.[variant] : undefined;
}

// --------------------------------------------------

const ToastRoot = forwardRef<ViewRef, ToastRootProps>((props, ref) => {
  const globalConfig = useToastConfig();
  const toastOptions = globalConfig?.toastOptions;
  const toastColorScheme = getToastColorScheme(toastOptions);
  const {
    children,
    variant: localVariant,
    placement: localPlacement,
    index,
    total,
    heights,
    maxVisibleToasts,
    className,
    style,
    animation: localAnimation,
    isSwipeable: localIsSwipeable,
    isAnimatedStyleActive = true,
    hide,
    ...restProps
  } = props;

  /**
   * Merge global config with local props, ensuring local props take precedence
   */
  const variant = localVariant ?? globalConfig?.variant ?? 'default';
  const variantOptions = getVariantOptions(toastOptions, variant);
  const placement = localPlacement ?? globalConfig?.placement ?? 'top';
  const animation = localAnimation ?? globalConfig?.animation;
  const isSwipeable = localIsSwipeable ?? globalConfig?.isSwipeable;
  const themeStyles = useMemo(
    () => getToastThemeStyles(toastColorScheme, variant),
    [toastColorScheme, variant]
  );

  // Access id from props (id is omitted from ToastRootProps type but available at runtime)
  const toastProps = props as ToastRootProps & Pick<ToastComponentProps, 'id'>;
  const { id } = toastProps;

  const rootClassName = toastClassNames.root({
    className,
  });
  void rootClassName;

  const {
    rContainerStyle,
    entering,
    exiting,
    panGesture,
    isAllAnimationsDisabled,
  } = useToastRootAnimation({
    animation,
    index,
    total,
    heights,
    placement,
    hide,
    id,
    isSwipeable,
    maxVisibleToasts,
  });

  const rootStyle = isAnimatedStyleActive
    ? [
        toastStyleSheet.root,
        themeStyles.root,
        rContainerStyle,
        toastOptions?.styles?.toast,
        variantOptions?.styles?.toast,
        style,
      ]
    : [
        toastStyleSheet.root,
        themeStyles.root,
        toastOptions?.styles?.toast,
        variantOptions?.styles?.toast,
        style,
      ];

  // Extract padding and backgroundColor for placeholder Views after provider overrides.
  const { topStyle, bottomStyle } = useVerticalPlaceholderStyles({
    style: rootStyle,
  });

  const animationSettingsContextValue = useMemo(
    () => ({
      isAllAnimationsDisabled,
    }),
    [isAllAnimationsDisabled]
  );

  const contextValue = useMemo(
    () => ({
      variant,
      hide,
      id,
    }),
    [variant, hide, id]
  );

  return (
    <AnimationSettingsProvider value={animationSettingsContextValue}>
      <ToastProvider value={contextValue}>
        <GestureDetector gesture={panGesture}>
          <Animated.View
            style={
              placement === 'top'
                ? toastStyleSheet.placementTop
                : toastStyleSheet.placementBottom
            }
            entering={entering}
            exiting={exiting}
          >
            {/* Animated toast instance */}
            <AnimatedToastRoot
              ref={ref}
              className={cn(
                rootClassName,
                toastOptions?.classNames?.toast,
                variantOptions?.classNames?.toast
              )}
              style={rootStyle}
              {...restProps}
            >
              {children}
              {/* 
                When visible toasts have different heights, the toast adapts to the last visible toast height.
                In cases where a toast originally has one height and gets smaller when a new toast comes to stack,
                content might be visible behind the last toast without proper padding.
                The placeholder Views ensure that the content under active toast is hidden.
              */}
              <View style={[toastStyleSheet.placeholderTop, topStyle]} />
              <View style={[toastStyleSheet.placeholderBottom, bottomStyle]} />
              {themeStyles.outline ? (
                <View
                  pointerEvents="none"
                  style={[
                    toastStyleSheet.outline,
                    themeStyles.outline,
                    toastOptions?.styles?.outline,
                    variantOptions?.styles?.outline,
                  ]}
                />
              ) : null}
            </AnimatedToastRoot>
            {/* Hidden toast instance for height measurement */}
            <AnimatedToastRoot
              pointerEvents="none"
              style={[
                toastStyleSheet.root,
                toastStyleSheet.hiddenMeasure,
                style,
              ]}
              onLayout={(event) => {
                const measuredHeight = event.nativeEvent.layout.height;
                heights.modify((value) => {
                  'worklet';
                  return { ...value, [id]: measuredHeight };
                });
              }}
              {...restProps}
            >
              {children}
            </AnimatedToastRoot>
          </Animated.View>
        </GestureDetector>
      </ToastProvider>
    </AnimationSettingsProvider>
  );
});

// --------------------------------------------------

const ToastTitle = forwardRef<TextRef, ToastTitleProps>((props, ref) => {
  const {
    children,
    className,
    style,
    textSize = 'subheadline',
    ...restProps
  } = props;

  const { variant } = useToast();
  const globalConfig = useToastConfig();
  const toastOptions = globalConfig?.toastOptions;
  const variantOptions = getVariantOptions(toastOptions, variant);
  const toastColorScheme = getToastColorScheme(toastOptions);
  const themeStyles = useMemo(
    () => getToastThemeStyles(toastColorScheme, variant),
    [toastColorScheme, variant]
  );

  const labelClassName = toastClassNames.label({
    variant,
    className,
  });
  void labelClassName;

  return (
    <ToastText
      ref={ref}
      className={cn(
        labelClassName,
        toastOptions?.classNames?.title,
        variantOptions?.classNames?.title
      )}
      style={[
        toastStyleSheet.title,
        toastTextSizeStyles[textSize],
        themeStyles.title,
        toastOptions?.styles?.title,
        variantOptions?.styles?.title,
        style,
      ]}
      {...restProps}
    >
      {children}
    </ToastText>
  );
});

// --------------------------------------------------

const ToastDescription = forwardRef<TextRef, ToastDescriptionProps>(
  (props, ref) => {
    const {
      children,
      className,
      style,
      textSize = 'footnote',
      ...restProps
    } = props;
    const globalConfig = useToastConfig();
    const toastOptions = globalConfig?.toastOptions;
    const { variant } = useToast();
    const variantOptions = getVariantOptions(toastOptions, variant);
    const toastColorScheme = getToastColorScheme(toastOptions);
    const themeStyles = useMemo(
      () => getToastThemeStyles(toastColorScheme, variant),
      [toastColorScheme, variant]
    );

    const descriptionClassName = toastClassNames.description({
      className,
    });
    void descriptionClassName;

    return (
      <ToastText
        ref={ref}
        className={cn(
          descriptionClassName,
          toastOptions?.classNames?.description,
          variantOptions?.classNames?.description
        )}
        style={[
          toastStyleSheet.description,
          toastTextSizeStyles[textSize],
          themeStyles.description,
          toastOptions?.styles?.description,
          variantOptions?.styles?.description,
          style,
        ]}
        {...restProps}
      >
        {children}
      </ToastText>
    );
  }
);

// --------------------------------------------------

const ToastAction = forwardRef<View, ToastActionProps>((props, ref) => {
  const {
    children,
    variant,
    size = 'sm',
    animation,
    className,
    style,
    ...restProps
  } = props;

  const { variant: toastVariant } = useToast();
  const globalConfig = useToastConfig();
  const toastOptions = globalConfig?.toastOptions;
  const variantOptions = getVariantOptions(toastOptions, toastVariant);

  const actionClassName = toastClassNames.action({
    variant: toastVariant,
    className,
  });

  const [
    themeColorDefaultHover,
    themeColorInfoHover,
    themeColorSuccessHover,
    themeColorWarningHover,
    themeColorDangerHover,
  ] = useThemeColor([
    'default-hover',
    'info-hover',
    'success-hover',
    'warning-hover',
    'danger-hover',
  ]);

  const highlightColorMap = useMemo(() => {
    switch (toastVariant) {
      case 'default':
        return themeColorDefaultHover;
      case 'info':
        return themeColorInfoHover;
      case 'success':
        return themeColorSuccessHover;
      case 'warning':
        return themeColorWarningHover;
      case 'danger':
        return themeColorDangerHover;
    }
  }, [
    toastVariant,
    themeColorDefaultHover,
    themeColorInfoHover,
    themeColorSuccessHover,
    themeColorWarningHover,
    themeColorDangerHover,
  ]);

  const buttonVariant = useMemo(() => {
    if (variant) return variant;

    switch (toastVariant) {
      case 'info':
        return 'primary';
      case 'danger':
        return 'danger';
      default:
        return 'tertiary';
    }
  }, [toastVariant, variant]);

  const defaultHighlightConfig = useMemo(
    () => ({
      backgroundColor: { value: highlightColorMap },
      opacity: { value: [0, 1] as [number, number] },
    }),
    [highlightColorMap]
  );

  const resolvedAnimation =
    typeof animation === 'object' && animation !== null ? animation : undefined;
  const actionStyle = useMemo(() => {
    if (typeof style === 'function') {
      return (state: any) => [
        toastOptions?.styles?.actionButton,
        variantOptions?.styles?.actionButton,
        style(state),
      ];
    }

    return [
      toastOptions?.styles?.actionButton,
      variantOptions?.styles?.actionButton,
      style,
    ];
  }, [
    style,
    toastOptions?.styles?.actionButton,
    variantOptions?.styles?.actionButton,
  ]);

  const mergedAnimation = useMemo<ToastActionProps['animation']>(() => {
    if (
      animation === false ||
      animation === 'disabled' ||
      animation === 'disable-all'
    ) {
      return animation;
    }

    return {
      scale: false,
      ...resolvedAnimation,
      highlight: resolvedAnimation?.highlight ?? defaultHighlightConfig,
    };
  }, [animation, resolvedAnimation, defaultHighlightConfig]);

  return (
    <Button
      ref={ref}
      variant={buttonVariant}
      size={size}
      className={cn(
        actionClassName,
        toastOptions?.classNames?.actionButton,
        variantOptions?.classNames?.actionButton
      )}
      style={actionStyle}
      feedbackVariant="scale-highlight"
      animation={mergedAnimation}
      {...restProps}
    >
      {children}
    </Button>
  );
});

// --------------------------------------------------

const ToastClose = forwardRef<View, ToastCloseProps>((props, ref) => {
  const {
    children,
    iconProps,
    size = 'sm',
    className,
    style,
    onPress,
    ...restProps
  } = props;
  const { hide, id, variant: toastVariant } = useToast();
  const globalConfig = useToastConfig();
  const toastOptions = globalConfig?.toastOptions;
  const variantOptions = getVariantOptions(toastOptions, toastVariant);

  const themeColorMuted = useThemeColor('muted');
  const closeStyle = useMemo(() => {
    if (typeof style === 'function') {
      return (state: any) => [
        toastOptions?.styles?.closeButton,
        variantOptions?.styles?.closeButton,
        style(state),
      ];
    }

    return [
      toastOptions?.styles?.closeButton,
      variantOptions?.styles?.closeButton,
      style,
    ];
  }, [
    style,
    toastOptions?.styles?.closeButton,
    variantOptions?.styles?.closeButton,
  ]);

  /**
   * Handle close button press
   * If hide and id are available from context, use them to hide the toast
   * Otherwise, use the provided onPress handler
   */
  const handlePress = (event: any) => {
    if (hide && id) {
      hide(id);
    }
    if (onPress && typeof onPress === 'function') {
      onPress(event);
    }
  };

  return (
    <Button
      ref={ref}
      variant="ghost"
      size={size}
      isIconOnly
      aria-label="Close"
      className={cn(
        className,
        toastOptions?.classNames?.closeButton,
        variantOptions?.classNames?.closeButton
      )}
      style={closeStyle}
      onPress={handlePress}
      {...restProps}
    >
      {children ?? (
        <CloseIcon
          size={iconProps?.size ?? 16}
          color={iconProps?.color ?? themeColorMuted}
        />
      )}
    </Button>
  );
});

// --------------------------------------------------

/**
 * Default styled toast component for simplified toast.show() API
 * Used internally when showing toasts with string or config object (without component)
 */
export function DefaultToast(props: DefaultToastProps) {
  const globalConfig = useToastConfig();
  const toastOptions = globalConfig?.toastOptions;
  const toastColorScheme = getToastColorScheme(toastOptions);

  const {
    id,
    variant: localVariant,
    placement: localPlacement,
    isSwipeable: localIsSwipeable,
    animation: localAnimation,
    label,
    description,
    actionLabel,
    onActionPress,
    icon,
    iconSize = 20,
    textSize,
    labelTextSize,
    descriptionTextSize,
    labelStyle,
    descriptionStyle,
    hide,
    show,
    style,
    ...toastComponentProps
  } = props;

  /**
   * Merge global config with local props, ensuring local props take precedence
   */
  const variant = localVariant ?? globalConfig?.variant ?? 'default';
  const variantOptions = getVariantOptions(toastOptions, variant);
  const placement = localPlacement ?? globalConfig?.placement ?? 'top';
  const isSwipeable = localIsSwipeable ?? globalConfig?.isSwipeable;
  const animation = localAnimation ?? globalConfig?.animation;
  const iconColor = toastVariantColorsByScheme[toastColorScheme][variant];
  const resolvedIcon =
    icon ??
    (variant === 'success' ||
    variant === 'warning' ||
    variant === 'danger' ||
    variant === 'info'
      ? defaultIconByVariant[variant]
      : undefined);
  const resolvedLabelTextSize = labelTextSize ?? textSize ?? 'subheadline';
  const resolvedDescriptionTextSize =
    descriptionTextSize ?? textSize ?? 'footnote';

  const handleActionPress = () => {
    if (onActionPress) {
      onActionPress({ show, hide });
    }
  };

  return (
    <ToastRoot
      id={id}
      variant={variant}
      placement={placement}
      isSwipeable={isSwipeable}
      animation={animation}
      style={[toastStyleSheet.defaultToastRoot, style]}
      hide={hide}
      show={show}
      {...toastComponentProps}
    >
      {resolvedIcon && (
        <View
          style={[
            toastStyleSheet.iconContainer,
            { height: iconSize + 4, width: iconSize + 4 },
            toastOptions?.styles?.icon,
            variantOptions?.styles?.icon,
          ]}
          className={cn(
            toastOptions?.classNames?.icon,
            variantOptions?.classNames?.icon
          )}
        >
          <ToastIcon icon={resolvedIcon} color={iconColor} size={iconSize} />
        </View>
      )}
      <View
        className={cn(
          toastOptions?.classNames?.content,
          variantOptions?.classNames?.content
        )}
        style={[
          toastStyleSheet.content,
          toastOptions?.styles?.content,
          variantOptions?.styles?.content,
        ]}
      >
        {label && (
          <ToastTitle textSize={resolvedLabelTextSize} style={labelStyle}>
            {label}
          </ToastTitle>
        )}
        {description && (
          <ToastDescription
            textSize={resolvedDescriptionTextSize}
            style={descriptionStyle}
          >
            {description}
          </ToastDescription>
        )}
      </View>
      {actionLabel && (
        <ToastAction onPress={handleActionPress}>{actionLabel}</ToastAction>
      )}
    </ToastRoot>
  );
}

// --------------------------------------------------

ToastRoot.displayName = DISPLAY_NAME.TOAST_ROOT;
ToastTitle.displayName = DISPLAY_NAME.TOAST_TITLE;
ToastDescription.displayName = DISPLAY_NAME.TOAST_DESCRIPTION;
ToastAction.displayName = DISPLAY_NAME.TOAST_ACTION;
ToastClose.displayName = DISPLAY_NAME.TOAST_CLOSE;

/**
 * Compound Toast component with sub-components
 *
 * @component Toast - Main toast container that displays notification messages with various variants.
 *
 * @component Toast.Title - Title/heading text of the toast notification.
 *
 * @component Toast.Description - Descriptive text content of the toast.
 *
 * @component Toast.Action - Action button within the toast. Variant is automatically determined
 * based on toast variant but can be overridden.
 *
 * @component Toast.Close - Close button for dismissing the toast. Renders as an icon-only button.
 *
 * Props flow from Toast to sub-components via context (variant).
 */
const CompoundToast = Object.assign(ToastRoot, {
  /** Toast title - renders text content */
  Title: ToastTitle,
  /** Toast description - renders descriptive text */
  Description: ToastDescription,
  /** Toast action button - renders action with appropriate variant */
  Action: ToastAction,
  /** Toast close button - renders icon-only close button */
  Close: ToastClose,
});

export default CompoundToast;
